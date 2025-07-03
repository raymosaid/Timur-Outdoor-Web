'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { authenticate } from "@/lib/action"
import { cn } from "@/lib/utils"
import { CircleAlert, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isPending, setIsPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsPending(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    // const res = await authenticate(formData)
    // setErrorMessage(res)
    // setIsPending(false)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter username to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="username"
                  placeholder="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {!isPending ? <>Login</> : <><Loader2 className="animate-spin" />Please wait</>}
              </Button>
            </div>
            <div className={`${!errorMessage ? 'sr-only' : ''} flex h-8 items-end space-x-1`}>
              {errorMessage && (
                <>
                  <CircleAlert className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
