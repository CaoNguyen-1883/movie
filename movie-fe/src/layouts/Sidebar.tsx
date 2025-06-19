"use client"

import { NavLink } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { PERMISSIONS } from "@/constants/permissions"
import { cn } from "@/lib/utils"
import { Home, Shield, Video, Users, ShieldCheck, Library, Contact, Clapperboard } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


interface SidebarProps {
  isSidebarOpen: boolean;
}

export function Sidebar({ isSidebarOpen }: SidebarProps) {
  const { hasPermission } = useAuth()

  const isAdmin = hasPermission(PERMISSIONS.VIEW_DASHBOARD)

  const NavItem = ({
    to,
    end = false,
    icon,
    label,
  }: {
    to: string;
    end?: boolean;
    icon: React.ReactNode;
    label: string;
  }) => (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                { 'bg-muted text-primary': isActive },
                { 'justify-center': !isSidebarOpen }
              )
            }
          >
            {icon}
            {isSidebarOpen && <span>{label}</span>}
          </NavLink>
        </TooltipTrigger>
        {!isSidebarOpen && (
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="hidden border-r bg-muted/40 md:flex md:flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <Video className="h-6 w-6" />
          {isSidebarOpen && <span>Movie App</span>}
        </NavLink>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
          <NavItem to="/" end icon={<Home className="h-4 w-4" />} label="Home" />
          <NavItem to="/movies" icon={<Clapperboard className="h-4 w-4" />} label="Movies" />
          
          {isAdmin && (
            <>
              <NavItem
                to="/admin"
                end
                icon={<Shield className="h-4 w-4" />}
                label="Dashboard"
              />
              <NavItem
                to="/admin/users"
                icon={<Users className="h-4 w-4" />}
                label="Users"
              />
              <NavItem
                to="/admin/roles"
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Roles"
              />
              <NavItem
                to="/admin/genres"
                icon={<Library className="h-4 w-4" />}
                label="Genres"
              />
              {hasPermission(PERMISSIONS.READ_PEOPLE) && (
                <NavItem
                  to="/admin/people"
                  icon={<Contact className="h-4 w-4" />}
                  label="People"
                />
              )}
              {hasPermission(PERMISSIONS.READ_MOVIES) && (
                <NavItem
                  to="/admin/movies"
                  icon={<Clapperboard className="h-4 w-4" />}
                  label="Movies"
                />
              )}
            </>
          )}
        </nav>
      </div>
    </div>
  )
} 