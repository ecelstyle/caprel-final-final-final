import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, ShoppingCart, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const NewOrder = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [searchProduct, setSearchProduct] = useState("");

  const clients = [
    { id: "C002", name: "Restaurant Al Bahr", limit: 30000, exposure: 32000 },
    { id: "C001", name: "Epicerie Safi Plus", limit: 20000, exposure: 15000 },
    { id: "C003", name: "Marche Central Casa", limit: 50000, exposure: 10000 },
  ];

  const products = [
    { id: "P001", name: "Câpres Surfines de Pantelleria", price: 12.5, unit: "kg", stock: 150 },
    { id: "P002", name: "Olives Vertes Picholine", price: 8.0, unit: "kg", stock: 300 },
    { id: "P003", name: "Olives Noires Kalamata", price: 9.5, unit: "kg", stock: 250 },
    { id: "P004", name: "Huile d'Olive Extra Vierge AOP", price: 45.0, unit: "L", stock: 80 },
    { id: "P005", name: "Câpres au Vinaigre Balsamique", price: 15.0, unit: "kg", stock: 120 },
    { id: "P006", name: "Olives Farcies aux Poivrons", price: 10.5, unit: "kg", stock: 200 },
    { id: "P007", name: "Tapenade aux Câpres et Olives", price: 18.0, unit: "kg", stock: 90 },
    { id: "P008", name: "Huile d'Olive Vierge Bio", price: 38.0, unit: "L", stock: 150 },
  ];

  const selectedClientData = clients.find((c) => c.id === selectedClient);
  const availableCredit = selectedClientData ? selectedClientData.limit - selectedClientData.exposure : 0;
  const orderTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const wouldExceedLimit = orderTotal > availableCredit;

  const addProduct = (product: any) => {
    if (product.stock === 0) {
      toast.error("Product out of stock");
      return;
    }

    const existing = orderItems.find((item) => item.id === product.id);
    if (existing) {
      setOrderItems(
        orderItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setOrderItems([...orderItems, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to order`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(orderItems.filter((item) => item.id !== productId));
    } else {
      setOrderItems(
        orderItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const handleCreateOrder = () => {
    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }

    if (orderItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    if (wouldExceedLimit) {
      toast.error("Order exceeds client credit limit!");
      return;
    }

    toast.success("Order created successfully!");
    // Reset form
    setSelectedClient("");
    setOrderItems([]);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Order</h1>
          <p className="text-muted-foreground">Add products and verify credit availability</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Client Selection & Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selection */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Select Client</CardTitle>
                <CardDescription>Choose the client for this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Choose a client..." />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} ({client.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedClientData && (
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credit Limit:</span>
                        <span className="font-semibold">
                          {selectedClientData.limit.toLocaleString()} €
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Exposure:</span>
                        <span className="font-semibold">
                          {selectedClientData.exposure.toLocaleString()} €
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available Credit:</span>
                        <span
                          className={`font-semibold ${availableCredit < 0 ? "text-destructive" : "text-success"}`}
                        >
                          {availableCredit.toLocaleString()} €
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Add Products</CardTitle>
                <CardDescription>Search and add products to the order</CardDescription>
                <div className="pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10"
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent-light transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.price} € / {product.unit} • Stock: {product.stock} {product.unit}
                        </div>
                      </div>
                      <Button
                        onClick={() => addProduct(product)}
                        disabled={product.stock === 0}
                        size="sm"
                        variant={product.stock === 0 ? "outline" : "default"}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                  Order Summary
                </CardTitle>
                <CardDescription>{orderItems.length} items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No items added yet</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.price} € / {item.unit}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-7 w-7 p-0"
                            >
                              -
                            </Button>
                            <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-7 w-7 p-0"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">{orderTotal.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{orderTotal.toFixed(2)} €</span>
                      </div>
                    </div>

                    {wouldExceedLimit && selectedClient && (
                      <div className="p-3 bg-destructive/10 border border-destructive rounded-lg flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-destructive">Credit Limit Exceeded</p>
                          <p className="text-muted-foreground">
                            This order exceeds the client's available credit by{" "}
                            {(orderTotal - availableCredit).toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleCreateOrder}
                      disabled={wouldExceedLimit || !selectedClient}
                      className="w-full bg-gradient-primary hover:opacity-90"
                      size="lg"
                    >
                      Create Order
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewOrder;
