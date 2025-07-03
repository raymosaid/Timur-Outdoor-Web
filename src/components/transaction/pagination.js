import { DashboardContext } from "@/app/(main)/provider"
import { useContext } from "react"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export const Pagination = ({ totalRows, rowsShowed }) => {
  console.log("rowsShowed", rowsShowed)
  const { page, setPage, limit, setLimit } = useContext(DashboardContext)
  return (
    <div className="flex items-center justify-between px-4 mt-4">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {page * limit} - {page * limit + rowsShowed} row(s) showed.
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              setLimit(Number(value))
            }}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue
                placeholder={limit}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 75, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {page + 1} of {Math.ceil(totalRows/limit)}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(0)}
            disabled={page <= 0}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => setPage(prev => (prev - 1))}
            disabled={page <= 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => setPage(prev => (prev + 1))}
            disabled={page >= Math.ceil(totalRows/limit) - 1}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => setPage(Math.ceil(totalRows/limit) - 1)}
            disabled={page >= Math.ceil(totalRows/limit) - 1}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}