import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IRole } from "@/types/role";

interface RoleCardProps {
  role: IRole;
}

export const RoleCard = ({ role }: RoleCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{role.name}</CardTitle>
        <CardDescription>{role.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="mb-2 font-semibold text-sm">Permissions:</h4>
        <div className="flex flex-wrap gap-2">
          {role.permissions && role.permissions.length > 0 ? (
            role.permissions.map((permission) => (
              <Badge key={permission._id} variant="secondary">
                {permission.name}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No permissions assigned.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 