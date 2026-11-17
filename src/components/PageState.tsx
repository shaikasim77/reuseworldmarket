import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
export function PageSkeleton() { return <div className="mx-auto max-w-5xl space-y-5 px-4 py-10" aria-label="Loading"><Skeleton className="h-10 w-52"/><Skeleton className="h-72 w-full"/><Skeleton className="h-12 w-3/4"/></div>; }
export function LoginPrompt({title}: {title:string}) {return <main className="mx-auto max-w-4xl px-4 py-16 text-center"><h1 className="text-3xl">Log in to {title}</h1><Button asChild className="mt-6"><Link to="/login">Login</Link></Button></main>;}