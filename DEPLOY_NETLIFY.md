# Netlify Deployment Guide

## Build Settings

- Build command: `npm run build`
- Publish directory: leave empty (handled by Next.js Netlify plugin)

`netlify.toml` is already configured with:

- `@netlify/plugin-nextjs`

## Required Environment Variables

Set these in Netlify Site Settings -> Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_REGISTER_KEY` (only needed if you use admin registration page)

## Deploy Steps

1. Push project to Git provider (GitHub/GitLab/Bitbucket).
2. In Netlify, create a new site from Git.
3. Select this repository and branch.
4. Confirm build command is `npm run build`.
5. Add the required environment variables.
6. Deploy.

## Notes

- This project uses Next.js App Router and middleware; Netlify plugin handles routing and server functions.
- After changing env values, trigger a new deploy.
