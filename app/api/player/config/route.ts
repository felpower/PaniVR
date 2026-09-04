import { NextResponse } from 'next/server';
import { publicAppwriteEndpoint, publicAppwriteProjectId } from '@/lib/appwrite-server';
export const runtime = 'nodejs';
export function GET(){return NextResponse.json({endpoint:publicAppwriteEndpoint||'',projectId:publicAppwriteProjectId||''})}
