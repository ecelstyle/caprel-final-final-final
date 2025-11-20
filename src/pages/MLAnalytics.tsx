import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Upload, TrendingUp, BarChart3, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MLAnalytics = () => {
  const [formData, setFormData] = useState({
    Type: "RESTAURANT",
    RiskLevel: "High",
    SectionViolations: "",
    Reason: "CANVASS",
    City: "Casablanca",
    PreviousResult: "",
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!formData.SectionViolations) {
      toast.error("Please enter the number of section violations");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("predict-inspection", {
        body: { facilityData: formData },
      });

      if (error) {
        throw error;
      }

      setPrediction(data);
      toast.success("Prediction completed successfully!");
    } catch (error: any) {
      console.error("Prediction error:", error);
      toast.error(error.message || "Failed to generate prediction");
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "text-success";
    if (confidence >= 0.5) return "text-warning-foreground";
    return "text-destructive";
  };

  const getClassColor = (className: string) => {
    if (className === "PASS") return "bg-success";
    if (className === "FAIL" || className === "SHUT-DOWN") return "bg-destructive";
    if (className === "PASS(CONDITIONAL)") return "bg-warning";
    return "bg-primary";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">ML Analytics & Prediction</h1>
          <p className="text-muted-foreground">
            AI-powered inspection result prediction using historical data patterns
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-3 pb-2">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-lg">ML Model</CardTitle>
                <CardDescription>Pattern Recognition</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced pattern recognition for inspection outcomes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-3 pb-2">
              <BarChart3 className="h-8 w-8 text-accent" />
              <div>
                <CardTitle className="text-lg">Training Data</CardTitle>
                <CardDescription>147,444 inspections</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Historical data from restaurants, schools, and stores
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-3 pb-2">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <CardTitle className="text-lg">7 Classes</CardTitle>
                <CardDescription>Prediction outcomes</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">From PASS to SHUT-DOWN classifications</p>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Form */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-primary" />
              Inspection Prediction
            </CardTitle>
            <CardDescription>Enter facility details to predict inspection outcome</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Facility Type</Label>
                  <Select value={formData.Type} onValueChange={(value) => setFormData({ ...formData, Type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                      <SelectItem value="GROCERY STORE">Grocery Store</SelectItem>
                      <SelectItem value="SCHOOL">School</SelectItem>
                      <SelectItem value="DAYCARE (2 - 6 YEARS)">Daycare</SelectItem>
                      <SelectItem value="CHILDREN'S SERVICES FACILITY">Children's Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="risk">Risk Level</Label>
                  <Select
                    value={formData.RiskLevel}
                    onValueChange={(value) => setFormData({ ...formData, RiskLevel: value })}
                  >
                    <SelectTrigger id="risk">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="violations">Section Violations</Label>
                  <Input
                    id="violations"
                    type="number"
                    placeholder="e.g., 32"
                    value={formData.SectionViolations}
                    onChange={(e) => setFormData({ ...formData, SectionViolations: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Number of violations found</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Inspection Reason</Label>
                  <Select
                    value={formData.Reason}
                    onValueChange={(value) => setFormData({ ...formData, Reason: value })}
                  >
                    <SelectTrigger id="reason">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CANVASS">Canvass</SelectItem>
                      <SelectItem value="COMPLAINT">Complaint</SelectItem>
                      <SelectItem value="LICENSE">License</SelectItem>
                      <SelectItem value="CANVASS RE-INSPECTION">Canvass Re-Inspection</SelectItem>
                      <SelectItem value="SUSPECTED FOOD POISONING">Suspected Food Poisoning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Casablanca"
                    value={formData.City}
                    onChange={(e) => setFormData({ ...formData, City: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="previous">Previous Result (Optional)</Label>
                  <Select
                    value={formData.PreviousResult}
                    onValueChange={(value) => setFormData({ ...formData, PreviousResult: value })}
                  >
                    <SelectTrigger id="previous">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="PASS">Pass</SelectItem>
                      <SelectItem value="FAIL">Fail</SelectItem>
                      <SelectItem value="PASS(CONDITIONAL)">Pass (Conditional)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePredict}
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              {isLoading ? (
                <>
                  <span className="animate-pulse">Analyzing...</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Predict Inspection Result
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Prediction Results */}
        {prediction && (
          <Card className="border-2 border-primary shadow-glow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Prediction Results
                </span>
                <Badge className={getClassColor(prediction.predicted_class)}>{prediction.predicted_class}</Badge>
              </CardTitle>
              <CardDescription>AI-generated inspection outcome prediction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Confidence Score */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Confidence Score</span>
                  <span className={`text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                    {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={prediction.confidence * 100} className="h-3" />
              </div>

              {/* Probability Distribution */}
              <div>
                <h4 className="font-semibold mb-4">Probability Distribution</h4>
                <div className="space-y-3">
                  {Object.entries(prediction.probabilities)
                    .sort(([, a]: any, [, b]: any) => b - a)
                    .map(([className, prob]: any) => (
                      <div key={className}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{className}</span>
                          <span className="text-sm font-semibold">{(prob * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={prob * 100} className="h-2" />
                      </div>
                    ))}
                </div>
              </div>

              {/* Reasoning */}
              {prediction.reasoning && (
                <div className="p-4 bg-accent-light rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">AI Analysis</h4>
                      <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dataset Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-accent" />
              Dataset Information
            </CardTitle>
            <CardDescription>Available data files for ML training and testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Data_Train.csv</h4>
                <p className="text-sm text-muted-foreground mb-2">147,444 training records</p>
                <Badge variant="outline">With labels</Badge>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Data_Test.csv</h4>
                <p className="text-sm text-muted-foreground mb-2">49,149 test records</p>
                <Badge variant="outline">No labels</Badge>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Sample_Submission.csv</h4>
                <p className="text-sm text-muted-foreground mb-2">Prediction format</p>
                <Badge variant="outline">7 classes</Badge>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Files location:</strong> <code className="text-xs bg-background px-2 py-1 rounded">/public/data/</code>
              </p>
              <p className="text-sm mt-2">
                <strong>Features:</strong> ID, Date, LicenseNo, FacilityID, Type, Street, City, State, Reason,
                SectionViolations, RiskLevel, Geo_Loc
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MLAnalytics;
