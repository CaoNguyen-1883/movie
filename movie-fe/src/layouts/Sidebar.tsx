"use client"

import { NavLink } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { PERMISSIONS } from "@/constants/permissions"
import { cn } from "@/lib/utils"
import { Home, Shield, Video } from "lucide-react"

export function Sidebar() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission(PERMISSIONS.MANAGE_USERS) // Or a more general admin permission

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
      { "bg-muted text-primary": isActive }
    );

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Video className="h-6 w-6" />
            <span className="">Movie App</span>
          </NavLink>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink to="/" end className={navLinkClasses}>
              <Home className="h-4 w-4" />
              Home
            </NavLink>

            {isAdmin && (
              <NavLink to="/admin" className={navLinkClasses}>
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </NavLink>
            )}
            
            {/* Add more navigation links here as the app grows */}
          </nav>
        </div>
      </div>
    </div>
  )
} 