"use client"

import { useState } from "react"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.add({
        title: "Passwords Mismatch",
        description: "Password and Confirm Password do not match.",
        type: "error",
      })
      return
    }

    setIsLoading(true)
    console.log("Signup submitted:", { name, email, password, confirmPassword })
    setTimeout(() => {
      setIsLoading(false)
      toast.add({
        title: "Account Created!",
        description: "Welcome to Social Media Manager.",
        type: "success",
      })
    }, 1200)
  }

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true)
    console.log("Google Signup clicked")
    setTimeout(() => {
      setIsGoogleLoading(false)
      toast.add({
        title: "Google Sign-up Successful",
        description: "Your account is ready to use.",
        type: "success",
      })
    }, 1200)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? <Spinner /> : "Create account"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isLoading || isGoogleLoading}
                  className="flex items-center justify-center gap-2"
                >
                  {isGoogleLoading ? <Spinner /> : <FcGoogle className="size-4" />}
                  Sign up with Google
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
