import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { Database } from '@hoop-master/types'

type MediaAsset = Database['public']['Tables']['media_assets']['Row']
type MediaAssetInsert = Database['public']['Tables']['media_assets']['Insert']

export function useMediaAssets(channelId?: string) {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchAssets = async () => {
      try {
        setLoading(true)
        setError(null)

        let query = supabase
          .from('media_assets')
          .select('*')
          .order('created_at', { ascending: false })

        if (channelId) {
          query = query.eq('category', channelId)
        }

        const { data, error: fetchError } = await query

        if (abortController.signal.aborted) return
        if (fetchError) throw fetchError
        setAssets(data || [])
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load assets')
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false)
      }
    }

    fetchAssets()
    return () => abortController.abort()
  }, [channelId])

  const createAsset = async (asset: MediaAssetInsert) => {
    const { data, error } = await supabase
      .from('media_assets')
      .insert(asset)
      .select()
      .single()

    if (error) throw error
    setAssets(prev => [data, ...prev])
    return data
  }

  const updateAsset = async (id: string, updates: Partial<MediaAssetInsert>) => {
    const { data, error } = await supabase
      .from('media_assets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setAssets(prev => prev.map(a => a.id === id ? data : a))
    return data
  }

  const deleteAsset = async (id: string) => {
    const { error } = await supabase.from('media_assets').delete().eq('id', id)
    if (error) throw error
    setAssets(prev => prev.filter(a => a.id !== id))
  }

  return { assets, loading, error, createAsset, updateAsset, deleteAsset }
}
