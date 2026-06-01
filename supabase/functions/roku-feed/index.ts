import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const channelId = url.searchParams.get("channel_id")
    const dateParam = url.searchParams.get("date")
    const targetDate = dateParam || new Date().toISOString().split("T")[0]
    const dayStart = `${targetDate}T00:00:00Z`
    const dayEnd = `${targetDate}T23:59:59Z`

    let channelQuery = supabase
      .from("media_channels")
      .select("id, name, slug, thumbnail_url")
      .eq("status", "active")
      .eq("is_public", true)

    if (channelId) {
      channelQuery = channelQuery.eq("id", channelId)
    }

    const { data: channels, error: chErr } = await channelQuery
    if (chErr) throw chErr

    const result: Record<string, unknown> = {
      provider: "Hoop With Her",
      date: targetDate,
      generatedAt: new Date().toISOString(),
      channels: [],
    }

    for (const ch of channels || []) {
      const { data: programs } = await supabase
        .from("epg_programs")
        .select("id, title, description, start_time, end_time, episode_number, season_number")
        .eq("channel_id", ch.id)
        .lte("start_time", dayEnd)
        .gte("end_time", dayStart)
        .order("start_time", { ascending: true })

      result.channels.push({
        id: ch.id,
        name: ch.name,
        slug: ch.slug,
        image: ch.thumbnail_url || "",
        number: ch.slug,
        program: (programs || []).map((p: Record<string, unknown>) => ({
          id: p.id,
          title: p.title,
          description: p.description || "",
          startTime: p.start_time,
          endTime: p.end_time,
          image: ch.thumbnail_url || "",
          episodeNumber: p.episode_number,
          seasonNumber: p.season_number,
        })),
      })
    }

    return new Response(JSON.stringify(result, null, 2), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "max-age=300",
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
