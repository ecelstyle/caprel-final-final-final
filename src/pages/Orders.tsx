import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Orders = () => {
  const orders = [
    { id: "CMD004", client: "Restaurant Al Bahr", clientId: "C002", status: "Pending", date: "2025-11-18", amount: "12,000 €", items: 15, statusColor: "bg-warning" },
    { id: "CMD005", client: "Epicerie Safi Plus", clientId: "C001", status: "Pending", date: "2025-11-18", amount: "8,000 €", items: 10, statusColor: "bg-warning" },
    { id: "CMD006", client: "Marche Central Casa", clientId: "C003", status: "Pending", date: "2025-11-18", amount: "5,000 €", items: 8, statusColor: "bg-warning" },
    { id: "CMD003", client: "Marche Central Casa", clientId: "C003", status: "In Progress", date: "2025-11-10", amount: "10,000 €", items: 12, statusColor: "bg-primary" },
    { id: "CMD002", client: "Restaurant Al Bahr", clientId: "C002", status: "Overdue", date: "2025-11-05", amount: "20,000 €", items: 25, statusColor: "bg-destructive" },
    { id: "CMD001", client: "Epicerie Safi Plus", clientId: "C001", status: "Paid", date: "2025-11-01", amount: "15,000 €", items: 18, statusColor: "bg-success" },
  ];

  const statusCounts = {
    total: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    inProgress: orders.filter(o => o.status === "In Progress").length,
    overdue: orders.filter(o => o.status === "Overdue").length,
    paid: orders.filter(o => o.status === "Paid").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
            <p className="text-muted-foreground">Track and manage all customer orders</p>
          </div>
          <Link to="/new-order">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-foreground">{statusCounts.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{statusCounts.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{statusCounts.overdue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{statusCounts.paid}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by order ID, client name..." className="pl-10" />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>Complete list of customer orders</CardDescription>
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
                    <th className="text-center py-3 px-4 font-semibold">Items</th>
                    <th className="text-right py-3 px-4 font-semibold">Amount</th>
                    <th className="text-center py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-accent-light/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{order.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{order.client}</div>
                          <div className="text-xs text-muted-foreground">{order.clientId}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={order.statusColor}>{order.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                      <td className="py-3 px-4 text-center">{order.items}</td>
                      <td className="py-3 px-4 text-right font-semibold">{order.amount}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toast.info(`Viewing order ${order.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toast.info(`Editing order ${order.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => toast.error(`Delete order ${order.id}`)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      </div>
    </DashboardLayout>
  );
};

export default Orders;
