'use client'

import { updateUserProfile } from "@/app/actions"
import Header from "@/components/headers"
import ChangePassword from "@/components/profile/change-password"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getImageData } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"


export default function Page() {
  const [userData, setUserData] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    const fetchUserData = async() => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserData(user)
    }
    fetchUserData()
  }, [])

  const onSubmit = async(e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const response = await updateUserProfile(form)
    console.log(response)
  }

  const onSubmitChangePassword = async(e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    console.log(form)
  }
  
  return (
    <>
      {/* <Header
        userData={userData}
      /> */}
      <div className="m-4 lg:m-[30px] rounded-lg bg-white">
        <div className="p-14 space-y-8">
          <form onSubmit={onSubmit}>
          {/* Avatar */}
          <div className="flex items-center gap-[65px]">
            <Avatar className="h-[100px] w-[100px] 2xl:h-[200px] 2xl:w-[200px]">
              {/* <AvatarImage src={userData ? userData?.user_metadata.avatar_url : ""} alt="avatar" /> */}
              <AvatarImage src={imagePreview ? imagePreview : process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + userData?.user_metadata.avatar_url} />
              <AvatarFallback className="">{userData ? (userData?.username ? userData.username.charAt(0).toUpperCase() : userData?.email.charAt(0).toUpperCase()) : "L"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Label>Ganti Foto</Label>
              <Input
                type="file"
                id="avatar"
                name="avatar"
                onChange={(event) => {
                  const { files, displayUrl} = getImageData(event)
                  setImagePreview(displayUrl);
                  // onChange(files);
                }}
              />
            </div>
          </div>
          {/* Personal Info */}
          <div className="flex flex-col gap-8 p-8 border rounded-lg border-primary/30">
            <div className="text-lg font-semibold">Personal Info</div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  name="username"
                  defaultValue={userData ? userData.user_metadata.username : ""}
                  placeholder="tambahkan username"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  defaultValue={userData ? userData.user_metadata.email : ""}
                  placeholder="ubah email"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Nomor Telepon</Label>
                <Input
                  name="phone_number"
                  defaultValue={userData ? userData.user_metadata.phone_number : ""}
                  placeholder="tambahkan nomor telepon"
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
          </form>

          {/* Change Password */}
          <div className="flex flex-col gap-8 p-8 border rounded-lg border-primary/30">
            <div className="text-lg font-semibold">Change Password</div>
            <ChangePassword />
          </div>


        </div>
      </div>
    </>
  )
}