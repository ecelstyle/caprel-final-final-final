import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Download, Eye, Edit, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Clients = () => {
  const clients = [
    {
      id: "C002",
      name: "Restaurant Al Bahr",
      city: "Casablanca",
      exposure: 32000,
      limit: 30000,
      percentage: 106.67,
      status: "Critical",
      orders: 8,
      lastOrder: "2025-11-18",
      statusColor: "bg-destructive",
    },
    {
      id: "C001",
      name: "Epicerie Safi Plus",
      city: "Safi",
      exposure: 15000,
      limit: 20000,
      percentage: 75,
      status: "Warning",
      orders: 12,
      lastOrder: "2025-11-18",
      statusColor: "bg-warning",
    },
    {
      id: "C003",
      name: "Marche Central Casa",
      city: "Casablanca",
      exposure: 10000,
      limit: 50000,
      percentage: 20,
      status: "Healthy",
      orders: 15,
      lastOrder: "2025-11-18",
      statusColor: "bg-success",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Clients Management</h1>
            <p className="text-muted-foreground">Monitor credit exposure and client relationships</p>
          </div>
          <Button 
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => toast.info("Add new client functionality")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total registered</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Exposure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">57,000 €</div>
              <p className="text-xs text-muted-foreground mt-1">Across all clients</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">At Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">1</div>
              <p className="text-xs text-muted-foreground mt-1">Exceeded credit limit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Credit Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">67%</div>
              <p className="text-xs text-muted-foreground mt-1">Of available credit</p>
            </CardContent>
          </Card>
        </div>

        {/* Client Cards */}
        <div className="grid gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">{client.name}</CardTitle>
                    <CardDescription>
                      {client.id} • {client.city}
                    </CardDescription>
                  </div>
                  <Badge className={client.statusColor}>{client.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Credit Exposure */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Credit Exposure</span>
                        <span className={`text-sm font-semibold ${client.percentage > 100 ? "text-destructive" : client.percentage > 75 ? "text-warning-foreground" : "text-success"}`}>
                          {client.percentage.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(client.percentage, 100)}
                        className={`h-3 ${client.percentage > 100 ? "bg-destructive/20" : client.percentage > 75 ? "bg-warning/20" : ""}`}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Exposure:</span>
                      <span className="font-semibold">{client.exposure.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credit Limit:</span>
                      <span className="font-semibold">{client.limit.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available:</span>
                      <span className={`font-semibold ${client.exposure > client.limit ? "text-destructive" : "text-success"}`}>
                        {(client.limit - client.exposure).toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent-light rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Orders</div>
                        <div className="text-2xl font-bold">{client.orders}</div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Order:</span>
                      <span className="font-medium">{client.lastOrder}</span>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => toast.info(`Viewing details for ${client.name}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => toast.info(`Editing ${client.name}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clients;
