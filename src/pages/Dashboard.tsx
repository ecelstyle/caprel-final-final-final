import { Users, TrendingUp, Package, AlertTriangle, Download, Search, Maximize2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

const Dashboard = () => {
  const stats = [
    { label: "Active Clients", value: "3", icon: Users, trend: "+2 this month", color: "text-primary" },
    { label: "Total Exposure", value: "57,000 €", icon: TrendingUp, trend: "Across all clients", color: "text-primary" },
    { label: "Average Exposure", value: "19,000 €", icon: Package, trend: "Per client", color: "text-accent" },
    { label: "Open Orders", value: "4", icon: Package, trend: "3 pending approval", color: "text-warning" },
  ];

  const recentOrders = [
    { id: "CMD004", client: "C002", status: "Pending", date: "2025-11-18", amount: "12,000 €", statusColor: "bg-warning" },
    { id: "CMD005", client: "C001", status: "Pending", date: "2025-11-18", amount: "8,000 €", statusColor: "bg-warning" },
    { id: "CMD006", client: "C003", status: "Pending", date: "2025-11-18", amount: "5,000 €", statusColor: "bg-warning" },
    { id: "CMD003", client: "C003", status: "In Progress", date: "2025-11-10", amount: "10,000 €", statusColor: "bg-primary" },
    { id: "CMD002", client: "C002", status: "Overdue", date: "2025-11-05", amount: "20,000 €", statusColor: "bg-destructive" },
    { id: "CMD001", client: "C001", status: "Paid", date: "2025-11-01", amount: "15,000 €", statusColor: "bg-success" },
  ];

  const creditExposure = [
    { name: "Restaurant Al Bahr", exposure: 32000, limit: 30000, percentage: 106.67, city: "Casablanca" },
    { name: "Epicerie Safi Plus", exposure: 15000, limit: 20000, percentage: 75, city: "Safi" },
    { name: "Marche Central Casa", exposure: 10000, limit: 50000, percentage: 20, city: "Casablanca" },
  ];

  const exposureByCity = [
    { city: "Casablanca", percentage: 45, amount: "25,650 €" },
    { city: "Safi", percentage: 35, amount: "19,950 €" },
    { city: "Others", percentage: 20, amount: "11,400 €" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Supplier Cockpit</h1>
          <p className="text-muted-foreground">360° visibility on clients, credit, orders, and risks</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risk Alerts */}
        <Card className="border-destructive border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <CardTitle className="text-xl">Risk Alerts</CardTitle>
            </div>
            <CardDescription>Immediate attention required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-destructive">Credit Limit Exceeded</h4>
                  <p className="text-sm text-muted-foreground">Restaurant Al Bahr</p>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
              <p className="text-sm mb-2">
                Current exposure: <strong>32,000 €</strong> / Limit: <strong>30,000 €</strong>
              </p>
              <p className="text-sm text-destructive font-medium">Exceeded by: +2,000 € (6.67%)</p>
            </div>

            <div className="p-4 bg-warning/10 rounded-lg border border-warning">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-warning-foreground">Order Overdue</h4>
                  <p className="text-sm text-muted-foreground">CMD002 - Restaurant Al Bahr</p>
                </div>
                <Badge className="bg-warning text-warning-foreground">High</Badge>
              </div>
              <p className="text-sm mb-2">
                Amount: <strong>20,000 €</strong> | Due: <strong>2025-11-05</strong>
              </p>
              <p className="text-sm text-warning-foreground font-medium">13 days overdue - Payment pending</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Orders</CardTitle>
                <CardDescription>Latest transactions and their status</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("Search orders")}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("Export orders")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Client</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-right py-3 px-4 font-semibold">Amount</th>
                    <th className="text-center py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-accent-light/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{order.id}</td>
                      <td className="py-3 px-4">{order.client}</td>
                      <td className="py-3 px-4">
                        <Badge className={order.statusColor}>{order.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                      <td className="py-3 px-4 text-right font-semibold">{order.amount}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toast.info(`Viewing order ${order.id}`)}
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Credit Surveillance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Credit Surveillance</CardTitle>
            <CardDescription>Real-time monitoring of client credit exposure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {creditExposure.map((client, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{client.name}</h4>
                    <p className="text-sm text-muted-foreground">{client.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {client.exposure.toLocaleString()} € / {client.limit.toLocaleString()} €
                    </p>
                    <p className={`text-sm font-medium ${client.percentage > 100 ? "text-destructive" : client.percentage > 75 ? "text-warning-foreground" : "text-success"}`}>
                      {client.percentage.toFixed(0)}% Loaded
                    </p>
                  </div>
                </div>
                <Progress
                  value={Math.min(client.percentage, 100)}
                  className={`h-3 ${client.percentage > 100 ? "bg-destructive/20" : client.percentage > 75 ? "bg-warning/20" : ""}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Exposure by City */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Exposure by City</CardTitle>
            <CardDescription>Geographic distribution of credit exposure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exposureByCity.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.city}</span>
                  <span className="text-sm text-muted-foreground">{item.amount}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Progress value={item.percentage} className="flex-1 h-3" />
                  <span className="text-sm font-semibold min-w-[3rem] text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Activity Timeline & Follow-ups</CardTitle>
            <CardDescription>Recent events and upcoming actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2025-11-18", time: "14:30", event: "New order CMD006 created by C003", type: "order" },
                { date: "2025-11-18", time: "10:15", event: "Credit alert: Restaurant Al Bahr exceeded limit", type: "alert" },
                { date: "2025-11-17", time: "16:45", event: "Payment received for CMD001 (15,000 €)", type: "payment" },
                { date: "2025-11-15", time: "09:00", event: "Follow-up call scheduled with C002 for overdue CMD002", type: "followup" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                  <div className="flex-shrink-0 w-16 text-xs text-muted-foreground">
                    <div>{activity.time}</div>
                    <div>{activity.date}</div>
                  </div>
                  <div
                    className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${
                      activity.type === "alert"
                        ? "bg-destructive"
                        : activity.type === "payment"
                          ? "bg-success"
                          : activity.type === "followup"
                            ? "bg-warning"
                            : "bg-primary"
                    }`}
                  />
                  <p className="text-sm flex-1">{activity.event}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
