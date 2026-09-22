import test from 'node:test'
import assert from 'node:assert/strict'
import { buildRokuFeed, buildTvCatalog, publicHttpsUrl, type TvAsset } from './catalog.js'

const asset: TvAsset = {
  id: 'film-1', title: 'Game film', description: null,
  storage_path: 'https://media.example.org/games/film.m3u8',
  thumbnail_url: 'https://media.example.org/posters/film.jpg',
  created_at: '2026-09-01T00:00:00Z', tags: ['Games'], category: 'game_film', duration_seconds: 120,
}

test('Roku feed and channel-builder catalog share only eligible public assets', () => {
  const catalog = buildTvCatalog([
    asset,
    { ...asset, id: 'film-2', storage_path: 'https://media.example.org/games/clip.mp4', tags: [] },
    { ...asset, id: 'private', storage_path: 'private/film.mp4' },
    { ...asset, id: 'signed', storage_path: 'https://media.example.org/film.m3u8?token=secret' },
    { ...asset, id: 'missing-art', thumbnail_url: '' },
  ])
  assert.deepEqual(catalog.videos.map(video => video.id), ['film-1', 'film-2'])
  assert.deepEqual(catalog.videos.map(video => video.streamFormat), ['hls', 'mp4'])
  const roku = buildRokuFeed(catalog)
  assert.deepEqual(roku.movies.map(movie => movie.content.videos[0].videoType), ['HLS', 'MP4'])
  assert.deepEqual(roku.movies[1].genres, ['game_film'])
  assert.equal(JSON.stringify(roku).includes('secret'), false)
})

test('catalog excludes malformed or credential-bearing addresses', () => {
  for (const url of ['http://example.org/a.mp4', 'https://u:p@example.org/a.mp4', 'https://example.org/a.mp4#x', 'https://example.org/a.mp4?key=x', 'javascript:alert(1)', '/film.mp4']) {
    assert.equal(publicHttpsUrl(url), null, url)
  }
})
