import { type ColumnDef } from "@tanstack/react-table"
import * as React from "react"
import type { Movie } from "@/types/movie"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { DataTableRowActions } from "./DataTableRowActions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { BackdropViewerModal } from "./BackdropViewerModal"

export const columns: ColumnDef<Movie>[] = [
  {
    accessorKey: "posterUrl",
    header: "Poster",
    cell: ({ row }) => {
      const posterUrl = row.getValue("posterUrl") as string;
      const title = row.getValue("title") as string;
      return (
        <Avatar className="h-32 w-20 rounded-md">
          <AvatarImage src={posterUrl} alt={title} className="object-cover" />
          <AvatarFallback className="rounded-md">{title.charAt(0)}</AvatarFallback>
        </Avatar>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "backdropUrls",
    header: "Backdrop",
    cell: ({ row }) => {
      const backdropUrls = row.original.backdropUrls
      const title = row.getValue("title") as string
      const [isModalOpen, setIsModalOpen] = React.useState(false)

      if (!backdropUrls || backdropUrls.length === 0) {
        return <div className="text-center text-muted-foreground">-</div>
      }

      return (
        <>
          <BackdropViewerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            urls={backdropUrls}
            title={title}
          />
          <button onClick={() => setIsModalOpen(true)} className="w-32 rounded-md overflow-hidden">
            <Avatar className="h-[72px] w-32 rounded-none">
              <AvatarImage src={backdropUrls[0]} alt={`${title} backdrop`} className="object-cover" />
              <AvatarFallback className="rounded-md">{title.charAt(0)}</AvatarFallback>
            </Avatar>
          </button>
        </>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <div className="font-medium text-base">{row.getValue("title")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "genres",
    header: "Genres",
    cell: ({ row }) => {
      const genres = row.original.genres;
      return (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {genres.map(genre => (
            <Badge key={genre._id} variant="outline">{genre.name}</Badge>
          ))}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "directors",
    header: "Directors",
    cell: ({ row }) => {
      const directors = row.original.directors;
      return (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {directors.map(d => (
            <Badge key={d._id} variant="secondary">{d.name}</Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "cast",
    header: "Cast",
    cell: ({ row }) => {
      const cast = row.original.cast;
      return (
        <div className="flex flex-col gap-1 max-w-xs">
          {cast.slice(0, 3).map(c => ( // show first 3 cast members
            <span key={c.actor._id} className="text-sm">
              {c.actor.name} <span className="text-muted-foreground">as {c.characterName}</span>
            </span>
          ))}
          {cast.length > 3 && <span className="text-xs text-muted-foreground">...and {cast.length - 3} more</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={cn("text-xs font-semibold", {
            "bg-yellow-400/80 text-yellow-900": status === "COMING_SOON",
            "bg-green-500/80 text-white": status === "NOW_SHOWING",
            "bg-blue-500/80 text-white": status === "RELEASED",
          })}
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => <div>{row.getValue("duration")} min</div>,
  },
  {
    accessorKey: "releaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Release Date" />
    ),
    cell: ({ row }) => {
      const releaseDate = row.getValue("releaseDate") as string;
      return <div>{new Date(releaseDate).toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 