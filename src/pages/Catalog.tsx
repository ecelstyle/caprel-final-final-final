import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Package } from "lucide-react";
import { toast } from "sonner";

const Catalog = () => {
  const products = [
    { id: "P001", name: "Câpres Surfines de Pantelleria", category: "Câpres", price: "12.50 €", unit: "kg", stock: 150, status: "In Stock" },
    { id: "P002", name: "Olives Vertes Picholine", category: "Olives", price: "8.00 €", unit: "kg", stock: 300, status: "In Stock" },
    { id: "P003", name: "Olives Noires Kalamata", category: "Olives", price: "9.50 €", unit: "kg", stock: 250, status: "In Stock" },
    { id: "P004", name: "Huile d'Olive Extra Vierge AOP", category: "Huiles", price: "45.00 €", unit: "L", stock: 80, status: "In Stock" },
    { id: "P005", name: "Câpres au Vinaigre Balsamique", category: "Câpres", price: "15.00 €", unit: "kg", stock: 20, status: "Low Stock" },
    { id: "P006", name: "Olives Farcies aux Poivrons", category: "Olives", price: "10.50 €", unit: "kg", stock: 200, status: "In Stock" },
    { id: "P007", name: "Tapenade aux Câpres et Olives", category: "Préparations", price: "18.00 €", unit: "kg", stock: 0, status: "Out of Stock" },
    { id: "P008", name: "Huile d'Olive Vierge Bio", category: "Huiles", price: "38.00 €", unit: "L", stock: 150, status: "In Stock" },
  ];

  const categories = ["All", "Câpres", "Olives", "Huiles", "Préparations"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
            <p className="text-muted-foreground">Manage your product inventory and pricing</p>
          </div>
          <Button 
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => toast.info("Add new product functionality")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{products.filter(p => p.status === "In Stock").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-foreground">{products.filter(p => p.status === "Low Stock").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{products.filter(p => p.status === "Out of Stock").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search products by name or ID..." className="pl-10" />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              {categories.map((cat) => (
                <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-accent">
                  {cat}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mb-2">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                  <Badge
                    className={
                      product.status === "In Stock"
                        ? "bg-success"
                        : product.status === "Low Stock"
                          ? "bg-warning"
                          : "bg-destructive"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.id} • {product.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="text-lg font-bold text-primary">{product.price}/{product.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <span className={`font-semibold ${product.stock === 0 ? "text-destructive" : product.stock < 50 ? "text-warning-foreground" : "text-foreground"}`}>
                    {product.stock} {product.unit}
                  </span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    size="sm"
                    onClick={() => toast.info(`Editing ${product.name}`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    size="sm"
                    onClick={() => toast.info(`Details for ${product.name}`)}
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Catalog;
