
// @ts-ignore
import { Listing } from './types.ts'

export const tmdbHeading = `## TMDB Data`

export function makeTMDbMarkdownSection ( listing:Listing ) {
    const detailsJSON = JSON.stringify( listing, null, 4 )

    return [
        tmdbHeading, 
        '```json',
        detailsJSON,
        '\n```'
    ].join('\n')
}

interface ListingContentsOptions {
    listing: Listing
    tmdb: Listing
}

export function makeNewListingContents ( options:ListingContentsOptions ) {

    const { listing, tmdb = {} }  = options


    const pageMeta = {
        title: listing.title, 
        slug: listing.slug, 
        description: listing?.description || tmdb?.overview || '', 
        // type: listing.type, 
        layout: '../../layouts/MainLayout.astro',
        
        // Merge in any other initial listing data
        ...listing
    }

    const hasTMDbData = Object.keys( tmdb ).length > 0

    const wrappedTmdbCode = hasTMDbData ? makeTMDbMarkdownSection( tmdb ) : ''

    return {
        markdownBody: wrappedTmdbCode,
        pageMeta
    }
}

export function getPartsFromMarkdown ( markdown: string ) {
    const [ existingContent, tmdbContent ] = markdown.split( tmdbHeading )

    return {
        existingContent, 
        tmdbContent
    }
}

export function parseTMDbMarkdown ( tmdbContent: string ) {
    const lines = tmdbContent.split('\n')

    // Get index of the opening JSON ticks
    const openingTicksIndex = lines.findIndex( line => line.trim() === '```json' )

    // Get index of the closing JSON ticks
    const closingTicksIndex = lines.findIndex( line => line.trim() === '```' )

    // Get the JSON string
    const jsonString = lines.slice( openingTicksIndex + 1, closingTicksIndex ).join('\n')

    // Parse the JSON
    return JSON.parse( jsonString )
}