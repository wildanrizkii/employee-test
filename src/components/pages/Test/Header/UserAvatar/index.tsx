"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserProps = {
  name: string
  nik: string
}

export function UserAvatar({ name, nik }: UserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border-2 border-red-500 h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>
            {name ? name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel>
          <p className="text-md font-semibold">Informasi Peserta</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            {/* Nama */}
            <div>
              <p className="text-sm text-muted-foreground">Nama lengkap</p>
              <p className="text-base font-medium">{name}</p>
            </div>

            {/* NIK */}
            <div>
              <p className="text-sm text-muted-foreground">NIK</p>
              <p className="text-base font-medium">{nik}</p>
            </div>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}
