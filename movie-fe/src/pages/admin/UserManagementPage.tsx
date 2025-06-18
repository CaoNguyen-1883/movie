import { UsersTable } from "@/components/admin/users/UsersTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function UserManagementPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage all users in the system.
                    </p>
                </div>
                <div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </div>
            <UsersTable />
        </div>
    );
} 