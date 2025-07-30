"use client"

import { useId, useMemo, useState } from "react"
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function ChangePassword() {
  const id = useId()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [pending, setPending] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  const checkStrength = (pass) => {
    const requirements = [
      { regex: /.{6,}/, text: "At least 6 characters" }
    ]

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }

  const strength = checkStrength(password)
  console.log("strength", strength)

  const changePassword = async() => {
    setPending(true)
    if(password === confirmPassword){
      const { error } = await supabase.auth.updateUser({
        password: password
      })
      if (!error) {
        toast({
          title: "Change Password Successful",
          description: `Password telah berhasil diubah`
        })
      } else {
        toast({
          variant: "destructive",
          title: "Change Password Failed",
          description: `Password gagal diubah`
        })
      }
    }
    setPending(false)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 max-w-sm">
        {/* New Password */}
        <div className="*:not-first:mt-2">
          <Label htmlFor={id}>New Password</Label>
          <div className="relative">
            <Input
              id={id}
              className="pe-9"
              placeholder="Password"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={`${id}-description`}
            />
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOffIcon size={16} aria-hidden="true" />
              ) : (
                <EyeIcon size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        
        {/* Confirm Password */}
        <div className="*:not-first:mt-2">
          <Label htmlFor={id}>Confirm Password</Label>
          <div className="relative">
            <Input
              id={id}
              className="pe-9"
              placeholder="Password"
              type={isVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-describedby={`${id}-description`}
            />
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOffIcon size={16} aria-hidden="true" />
              ) : (
                <EyeIcon size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Password strength description */}
      <p
        id={`${id}-description`}
        className="text-foreground mb-2 mt-6 text-sm font-medium"
      >
        Password must contain:
      </p>

      {/* Password requirements list */}
      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <CheckIcon
                size={16}
                className="text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <XIcon
                size={16}
                className="text-muted-foreground/80"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <Button
        className="mt-4"
        disabled={ pending || !strength[0].met || password !== confirmPassword }
        onClick={() => changePassword()}
      >
        Change Password
      </Button>
    </div>
  )
}