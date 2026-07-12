import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useCallback } from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Brain,
  Plus,
  Minus,
  FileText,
  Bell,
  ShoppingCart,
  BarChart3,
  Clock,
  DollarSign,
  Sparkles,
  Loader
} from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero.jpg";
import ApiTestComponent from "./ApiTestComponent";
import CustomerSupportChat from "./CustomerSupportChat";
import { apiService } from "@/lib/api";

// Type definitions
interface Product {
  product_id?: string;
  name?: string;
  category?: string;
  sku?: string;
  supplier_id?: string;
  current_stock?: number;
  reorder_threshold?: number;
  reorder_quantity?: number;
  cost_price?: number;
  selling_price?: number;
  description?: string;
  status?: string;
}

interface Order {
  order_id?: string;
  supplier_id?: string;
  status?: string;
  items?: Array<{
    product_id?: string;
    product_name?: string;
    quantity?: number;
    unit_price?: number;
    total_price?: number;
  }>;
  total_amount?: number;
  currency?: string;
  order_date?: string;
  expected_delivery_date?: string;
  notes?: string;
}

interface Alert {
  alert_id?: string;
  type?: string;
  severity?: string;
  title?: string;
  message?: string;
  status?: string;
  product_id?: string;
  supplier_id?: string;
  order_id?: string;
  created_at?: string;
  action_required?: boolean;
}

interface Supplier {
  supplier_id?: string;
  name?: string;
  company_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: string;
}

interface ApiResponse<T> {
  [key: string]: T[] | unknown;
}

const Dashboard = () => {
  // State for managing different dialogs
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isViewAlertsOpen, setIsViewAlertsOpen] = useState(false);
  const [isRunReportOpen, setIsRunReportOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  
  // Data states
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingKPIs, setLoadingKPIs] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Computed data states
  const [recentActivity, setRecentActivity] = useState<Array<{
    type: string;
    item: string;
    quantity: string;
    time: string;
    status: string;
  }>>([]);
  
  const [aiInsights, setAiInsights] = useState<Array<{
    type: string;
    title: string;
    description: string;
    confidence: number;
    priority: string;
    action: string;
    productId?: string;
  }>>([]);

  // KPI Data State
  const [kpiData, setKpiData] = useState([
    {
      title: "Total Inventory Value",
      value: "$0",
      change: "Loading...",
      trend: "up",
      icon: DollarSign,
      color: "primary"
    },
    {
      title: "Low Stock Items",
      value: "0",
      change: "Loading...",
      trend: "warning",
      icon: AlertTriangle,
      color: "warning"
    },
    {
      title: "Recent Orders",
      value: "0",
      change: "Loading...",
      trend: "up",
      icon: ShoppingCart,
      color: "interactive"
    },
    {
      title: "AI Recommendations",
      value: "0",
      change: "Loading...",
      trend: "ai",
      icon: Brain,
      color: "ai"
    }
  ]);
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    sku: '',
    supplier_id: '',
    current_stock: '',
    reorder_threshold: '',
    reorder_quantity: '',
    cost_price: '',
    selling_price: '',
    description: ''
  });
  
  const [orderForm, setOrderForm] = useState({
    supplier_id: '',
    items: [{ product_id: '', quantity: '', unit_price: '' }],
    expected_delivery_date: '',
    notes: ''
  });

  // Fetch data functions
  const fetchAlerts = async () => {
    setLoadingAlerts(true);
    try {
      const response = await apiService.getAlerts();
      setAlerts(((response as ApiResponse<Alert>).alerts as Alert[]) || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiService.getProducts();
      setProducts(((response as ApiResponse<Product>).products as Product[]) || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await apiService.getSuppliers();
      setSuppliers(((response as ApiResponse<Supplier>).suppliers as Supplier[]) || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSuppliers([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await apiService.getOrders();
      setOrders(((response as ApiResponse<Order>).orders as Order[]) || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchKPIs = useCallback(async () => {
    setLoadingKPIs(true);
    try {
      // Fetch all data needed for KPIs
      const [productsRes, ordersRes, alertsRes] = await Promise.all([
        apiService.getProducts(),
        apiService.getOrders(),
        apiService.getAlerts()
      ]);

      const fetchedProducts = ((productsRes as ApiResponse<Product>).products as Product[]) || [];
      const fetchedOrders = ((ordersRes as ApiResponse<Order>).orders as Order[]) || [];
      const fetchedAlerts = ((alertsRes as ApiResponse<Alert>).alerts as Alert[]) || [];

      // Update state with fetched data
      setProducts(fetchedProducts);
      setOrders(fetchedOrders);
      setAlerts(fetchedAlerts);

      // Calculate computed data
      setRecentActivity(calculateRecentActivity(fetchedProducts, fetchedOrders, fetchedAlerts));
      // AI insights will be fetched separately

      // Calculate Total Inventory Value
      const totalValue = fetchedProducts.reduce((sum, product) => {
        const stockValue = (product.current_stock || 0) * (product.cost_price || 0);
        return sum + stockValue;
      }, 0);

      // Calculate Low Stock Items
      const lowStockItems = fetchedProducts.filter(product => 
        (product.current_stock || 0) <= (product.reorder_threshold || 0)
      );
      const criticalStockItems = fetchedProducts.filter(product => 
        (product.current_stock || 0) <= (product.reorder_threshold || 0) * 0.5
      );

      // Calculate Recent Orders
      const activeOrders = fetchedOrders.filter(order => 
        ['pending', 'confirmed', 'shipped'].includes(order.status)
      );
      const pendingValue = activeOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      // Calculate AI Recommendations based on actual insights (will be updated by fetchAIInsights)
      const fallbackInsights = calculateFallbackInsights(fetchedProducts, fetchedOrders, fetchedAlerts);
      const newRecommendations = fallbackInsights.length;
      const highPriorityRecommendations = fallbackInsights.filter(insight => insight.priority === 'high').length;

      // Update KPI data with calculated values
      setKpiData([
        {
          title: "Total Inventory Value",
          value: `$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
          change: "+12.5%", // This would be calculated from historical data
          trend: "up",
          icon: DollarSign,
          color: "primary"
        },
        {
          title: "Low Stock Items",
          value: lowStockItems.length.toString(),
          change: `${criticalStockItems.length} critical`,
          trend: "warning",
          icon: AlertTriangle,
          color: "warning"
        },
        {
          title: "Recent Orders",
          value: `${activeOrders.length} Active`,
          change: `$${pendingValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} pending`,
          trend: "up",
          icon: ShoppingCart,
          color: "interactive"
        },
        {
          title: "AI Recommendations",
          value: `${newRecommendations} New`,
          change: `${highPriorityRecommendations} high priority`,
          trend: "ai",
          icon: Brain,
          color: "ai"
        }
      ]);

    } catch (error) {
      console.error('Error fetching KPI data:', error);
      setKpiData([
        {
          title: "Total Inventory Value",
          value: "Error",
          change: "Unable to load",
          trend: "up",
          icon: DollarSign,
          color: "primary"
        },
        {
          title: "Low Stock Items",
          value: "Error",
          change: "Unable to load",
          trend: "warning",
          icon: AlertTriangle,
          color: "warning"
        },
        {
          title: "Recent Orders",
          value: "Error",
          change: "Unable to load",
          trend: "up",
          icon: ShoppingCart,
          color: "interactive"
        },
        {
          title: "AI Recommendations",
          value: "Error",
          change: "Unable to load",
          trend: "ai",
          icon: Brain,
          color: "ai"
        }
      ]);
    } finally {
      setLoadingKPIs(false);
    }
  }, []); // No dependencies needed since apiService is stable

  useEffect(() => {
    fetchKPIs();
    fetchSuppliers(); // Still need suppliers for dropdowns
  }, [fetchKPIs]);

  // Will add fetchAIInsights useEffect after the function is defined

  // Mock data - would come from API
  const quickActions = [
    { 
      label: "Add New Product", 
      icon: Plus, 
      color: "interactive",
      action: () => {
        fetchSuppliers();
        setIsAddProductOpen(true);
      }
    },
    { 
      label: "Create Purchase Order", 
      icon: FileText, 
      color: "primary",
      action: () => {
        fetchSuppliers();
        fetchProducts();
        setIsCreateOrderOpen(true);
      }
    },
    { 
      label: "View Alerts", 
      icon: Bell, 
      color: "warning",
      action: () => {
        fetchAlerts();
        setIsViewAlertsOpen(true);
      }
    },
    { 
      label: "Run Report", 
      icon: BarChart3, 
      color: "success",
      action: () => {
        fetchProducts();
        setIsRunReportOpen(true);
      }
    }
  ];

  // Calculate real data from API responses
  const calculateRecentActivity = (products: Product[], orders: Order[], alerts: Alert[]) => {
    const activities = [];
    
    // Add recent orders
    orders.slice(0, 2).forEach(order => {
      const timeDiff = order.order_date ? 
        Math.floor((Date.now() - new Date(order.order_date).getTime()) / (1000 * 60 * 60)) : 0;
      
      activities.push({
        type: "order",
        item: `Purchase Order #${order.order_id}`,
        quantity: `${order.items?.length || 0} items - $${order.total_amount?.toFixed(2) || '0.00'}`,
        time: timeDiff < 24 ? `${timeDiff} hours ago` : `${Math.floor(timeDiff / 24)} days ago`,
        status: order.status || "pending"
      });
    });
    
    // Add recent alerts
    alerts.slice(0, 2).forEach(alert => {
      const timeDiff = alert.created_at ? 
        Math.floor((Date.now() - new Date(alert.created_at).getTime()) / (1000 * 60 * 60)) : 0;
      
      activities.push({
        type: "alert",
        item: alert.title || "System Alert",
        quantity: alert.message || "Alert notification",
        time: timeDiff < 24 ? `${timeDiff} hours ago` : `${Math.floor(timeDiff / 24)} days ago`,
        status: alert.status || "active"
      });
    });
    
    // Add low stock activities (simulated restock needs)
    const lowStockProducts = products.filter(p => 
      (p.current_stock || 0) <= (p.reorder_threshold || 0)
    ).slice(0, 1);
    
    lowStockProducts.forEach(product => {
      activities.push({
        type: "restock",
        item: product.name || "Unknown Product",
        quantity: `${product.current_stock || 0} units remaining`,
        time: "Recently detected",
        status: "pending"
      });
    });
    
    return activities.slice(0, 4); // Limit to 4 activities
  };

  const fetchAIInsights = useCallback(async () => {
    // Temporarily bypass MiniMax AI endpoint due to latency issues
    // and rely on rule-based fallback insights instead.
    setLoadingAI(true);
    try {
      const fallbackInsights = calculateFallbackInsights(products, orders, alerts);
      setAiInsights(fallbackInsights);
    } finally {
      setLoadingAI(false);
    }
  }, [products, orders, alerts]);

  const transformAIInsightsToUI = (aiResponse: {status?: string; predictions?: Array<{product_id?: string; product_name?: string; risk_level?: string; forecast_summary?: Record<string, unknown>}>}) => {
    const insights = [];
    
    if (aiResponse.predictions && Array.isArray(aiResponse.predictions)) {
      aiResponse.predictions.forEach((prediction, index: number) => {
        let priority = 'medium';
        let action = 'View details';
        let title = 'AI Prediction';
        let description = `Analysis for ${prediction.product_name || 'product'}`;
        
        // Map risk level to priority
        if (prediction.risk_level === 'high' || prediction.risk_level === 'critical') {
          priority = 'high';
          action = 'Review immediately';
          title = 'High Risk Detected';
        } else if (prediction.risk_level === 'low') {
          priority = 'low';
          action = 'Monitor trends';
          title = 'Stable Forecast';
        }
        
        // Generate meaningful description
        if (prediction.forecast_summary && Object.keys(prediction.forecast_summary).length > 0) {
          description = `AI analysis suggests ${prediction.risk_level} risk for ${prediction.product_name}. Recommend monitoring.`;
        }
        
        insights.push({
          type: "ai_prediction",
          title,
          description,
          confidence: 85, // Default confidence
          priority,
          action,
          productId: prediction.product_id
        });
      });
    }
    
    // If no predictions, add a general AI health insight
    if (insights.length === 0) {
      insights.push({
        type: "ai_analysis",
        title: "AI Inventory Analysis",
        description: "AI analysis is running to provide insights on your inventory health and forecasting.",
        confidence: 75,
        priority: "medium",
        action: "View AI health dashboard"
      });
    }
    
    return insights.slice(0, 3); // Limit to 3 insights
  };

  const calculateFallbackInsights = (products: Product[], orders: Order[], alerts: Alert[]) => {
    const insights = [];
    
    // Low stock insights
    const lowStockCount = products.filter(p => 
      (p.current_stock || 0) <= (p.reorder_threshold || 0)
    ).length;
    
    if (lowStockCount > 0) {
      insights.push({
        type: "alert",
        title: "Low Stock Alert",
        description: `${lowStockCount} products are running low and need restocking`,
        confidence: 95,
        priority: "high",
        action: "Review and reorder products"
      });
    }
    
    // Inventory value insight
    const totalValue = products.reduce((sum, product) => {
      return sum + ((product.current_stock || 0) * (product.cost_price || 0));
    }, 0);
    
    if (totalValue > 0) {
      insights.push({
        type: "optimization",
        title: "Inventory Value Analysis",
        description: `Current inventory worth $${totalValue.toLocaleString()}. Consider optimizing slow-moving items`,
        confidence: 82,
        priority: "medium",
        action: "Analyze turnover rates"
      });
    }
    
    return insights.slice(0, 3); // Limit to 3 insights
  };

  // Fetch AI insights after products/orders/alerts are loaded
  useEffect(() => {
    if (products.length > 0 || orders.length > 0 || alerts.length > 0) {
      fetchAIInsights();
    }
  }, [fetchAIInsights, products.length, orders.length, alerts.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "status-success";
      case "delivered": return "status-success";
      case "pending": return "status-warning";
      case "active": return "status-warning";
      case "confirmed": return "status-ai";
      case "shipped": return "status-ai";
      case "in-transit": return "status-ai";
      case "cancelled": return "text-muted-foreground";
      default: return "status-success";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "status-danger";
      case "medium": return "status-warning";
      case "low": return "status-success";
      default: return "status-success";
    }
  };

  // AI Insight Action Handlers
  const handleAiInsightAction = (insight: typeof aiInsights[0]) => {
    switch (insight.action) {
      case "Review and reorder products": {
        // Filter and show low stock products
        const lowStockProducts = products.filter(p => 
          (p.current_stock || 0) <= (p.reorder_threshold || 0)
        );
        console.log("Low stock products:", lowStockProducts);
        // Could open a dialog or navigate to a filtered product list
        alert(`Found ${lowStockProducts.length} products that need restocking:\n${lowStockProducts.map(p => `- ${p.name}: ${p.current_stock || 0} units remaining`).join('\n')}`);
        break;
      }
        
      case "Monitor delivery schedules": {
        // Show active orders
        const activeOrders = orders.filter(o => 
          ['pending', 'confirmed', 'shipped'].includes(o.status || '')
        );
        console.log("Active orders:", activeOrders);
        alert(`Active orders (${activeOrders.length}):\n${activeOrders.map(o => `- Order #${o.order_id}: ${o.status} - $${o.total_amount?.toFixed(2) || '0.00'}`).join('\n')}`);
        break;
      }
        
      case "Analyze turnover rates":
        // Show inventory analysis
        setIsAnalyticsDialogOpen(true);
        break;
        
      case "Address critical issues now":
        // Show critical alerts
        fetchAlerts();
        setIsViewAlertsOpen(true);
        break;
        
      case "View details":
      case "Review immediately":
      case "Monitor trends":
        // Handle AI-specific actions
        if (insight.productId) {
          alert(`AI Analysis for Product ID: ${insight.productId}\n\nAction: ${insight.action}\nConfidence: ${insight.confidence}%`);
        } else {
          alert(`AI Insight: ${insight.title}\n\n${insight.description}\n\nRecommended Action: ${insight.action}`);
        }
        break;
        
      case "View AI health dashboard":
        // Fetch and show AI health information
        apiService.getAIHealth().then(healthData => {
          const health = healthData as {health_analysis?: {overall_score?: number; status?: string; components?: Record<string, number>}};
          if (health.health_analysis) {
            alert(`AI Health Dashboard\n\nOverall Score: ${health.health_analysis.overall_score}%\nStatus: ${health.health_analysis.status}\n\nComponents:\n${Object.entries(health.health_analysis.components || {}).map(([key, value]) => `- ${key}: ${value}%`).join('\n')}`);
          }
        }).catch(error => {
          console.error('Failed to fetch AI health:', error);
          alert('AI Health Dashboard temporarily unavailable');
        });
        break;
        
      default:
        console.log("Unknown action:", insight.action);
        alert(`Action "${insight.action}" is not implemented yet.`);
    }
  };

  // Handle form submissions
  const handleAddProduct = async () => {
    try {
      const productData = {
        ...productForm,
        current_stock: parseFloat(productForm.current_stock) || 0,
        reorder_threshold: parseFloat(productForm.reorder_threshold) || 0,
        reorder_quantity: parseFloat(productForm.reorder_quantity) || 0,
        cost_price: parseFloat(productForm.cost_price) || 0,
        selling_price: parseFloat(productForm.selling_price) || 0
      };
      
      const response = await fetch(`http://localhost:5500/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      
      setIsAddProductOpen(false);
      setProductForm({
        name: '', category: '', sku: '', supplier_id: '', current_stock: '',
        reorder_threshold: '', reorder_quantity: '', cost_price: '', selling_price: '', description: ''
      });
      
      // You could add a toast notification here
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    }
  };

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        ...orderForm,
        items: orderForm.items.map(item => ({
          ...item,
          quantity: parseFloat(item.quantity) || 0,
          unit_price: parseFloat(item.unit_price) || 0
        }))
      };
      
      const response = await fetch(`http://localhost:5500/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      setIsCreateOrderOpen(false);
      setOrderForm({
        supplier_id: '',
        items: [{ product_id: '', quantity: '', unit_price: '' }],
        expected_delivery_date: '',
        notes: ''
      });
      
      alert('Purchase order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
         {/* Header Section */}
         <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
           <img 
             src={dashboardHero} 
             alt="Inventory Dashboard" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 flex items-center justify-between">
             <div className="text-white p-8">
               <h1 className="text-4xl font-bold mb-2">InventoryPulse Dashboard</h1>
               <p className="text-xl opacity-90">AI-powered inventory management and analytics</p>
             </div>
             <div className="p-8">
               <Button 
                 onClick={fetchKPIs} 
                 disabled={loadingKPIs}
                 className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                 variant="outline"
               >
                 {loadingKPIs ? (
                   <>
                     <Loader className="h-4 w-4 mr-2 animate-spin" />
                     Refreshing...
                   </>
                 ) : (
                   <>
                     <TrendingUp className="h-4 w-4 mr-2" />
                     Refresh Data
                   </>
                 )}
               </Button>
             </div>
           </div>
         </div>

      <div className="max-w-7xl mx-auto p-6 -mt-16 relative z-10">
                 {/* KPI Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {kpiData.map((kpi, index) => {
             const IconComponent = kpi.icon;
             return (
              <Card key={index} className="metric-card hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <IconComponent className={`h-5 w-5 ${
                    kpi.color === 'warning' ? 'text-warning' :
                    kpi.color === 'ai' ? 'text-ai' :
                    kpi.color === 'interactive' ? 'text-interactive' :
                    'text-primary'
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className={`text-xs ${
                    kpi.trend === 'warning' ? 'text-warning' :
                    kpi.trend === 'ai' ? 'text-ai' :
                    'text-success'
                  }`}>
                    {kpi.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-interactive" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full justify-start hover-lift ${
                      action.color === 'interactive' ? 'hover:bg-interactive hover:text-interactive-foreground' :
                      action.color === 'warning' ? 'hover:bg-warning hover:text-warning-foreground' :
                      action.color === 'success' ? 'hover:bg-success hover:text-success-foreground' :
                      'hover:bg-primary hover:text-primary-foreground'
                    }`}
                    onClick={action.action}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="lg:col-span-2 card-ai">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-ai ai-sparkle" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingAI ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-6 w-6 animate-spin text-ai" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading AI insights...</span>
                </div>
              ) : aiInsights.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No AI insights available</p>
                </div>
              ) : (
                aiInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg bg-ai-light border border-ai/20">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-ai">{insight.title}</h4>
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <Progress value={insight.confidence} className="w-20 h-2" />
                      <span className="text-xs font-medium">{insight.confidence}%</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="btn-ai text-xs"
                      onClick={() => handleAiInsightAction(insight)}
                    >
                      {insight.action}
                    </Button>
                  </div>
                </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent activity yet.</p>
                    <p className="text-sm text-muted-foreground">Activity will appear here as you use the system.</p>
                  </div>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'sale' ? 'bg-success' :
                        activity.type === 'restock' ? 'bg-interactive' :
                        activity.type === 'alert' ? 'bg-warning' :
                        activity.type === 'order' ? 'bg-ai' :
                        'bg-primary'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.item}</p>
                        <p className="text-xs text-muted-foreground">{activity.quantity}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Inventory Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No inventory data available.</p>
                    <p className="text-sm text-muted-foreground">Add products to see inventory overview.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Stock Health</span>
                        <span className={`text-sm ${
                          products.filter(p => (p.current_stock || 0) > (p.reorder_threshold || 0)).length / products.length > 0.8 
                            ? 'text-success' 
                            : products.filter(p => (p.current_stock || 0) > (p.reorder_threshold || 0)).length / products.length > 0.6
                            ? 'text-warning'
                            : 'text-destructive'
                        }`}>
                          Healthy: {Math.round((products.filter(p => (p.current_stock || 0) > (p.reorder_threshold || 0)).length / products.length) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.round((products.filter(p => (p.current_stock || 0) > (p.reorder_threshold || 0)).length / products.length) * 100)} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">
                          {products.filter(p => (p.current_stock || 0) > (p.reorder_threshold || 0)).length}
                        </div>
                        <div className="text-xs text-muted-foreground">In Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning">
                          {products.filter(p => 
                            (p.current_stock || 0) <= (p.reorder_threshold || 0) && (p.current_stock || 0) > 0
                          ).length}
                        </div>
                        <div className="text-xs text-muted-foreground">Low Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-destructive">
                          {products.filter(p => (p.current_stock || 0) === 0).length}
                        </div>
                        <div className="text-xs text-muted-foreground">Out of Stock</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Total Products</span>
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-primary">{products.length}</div>
                      <div className="text-xs text-muted-foreground">
                        Products in inventory
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* API Connection Test */}
        <div className="mt-8">
          <ApiTestComponent />
        </div>
      </div>

      {/* Customer Support Chat */}
      <CustomerSupportChat />

      {/* Add New Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input
                id="sku"
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier_id" className="text-right">
                Supplier
              </Label>
                             <Select onValueChange={(value) => setProductForm({ ...productForm, supplier_id: value })} defaultValue={productForm.supplier_id}>
                 <SelectTrigger className="col-span-3">
                   <SelectValue placeholder="Select a supplier" />
                 </SelectTrigger>
                 <SelectContent>
                   {suppliers.map((supplier) => (
                     <SelectItem key={supplier.supplier_id} value={supplier.supplier_id}>
                       {supplier.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current_stock" className="text-right">
                Current Stock
              </Label>
              <Input
                id="current_stock"
                type="number"
                value={productForm.current_stock}
                onChange={(e) => setProductForm({ ...productForm, current_stock: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reorder_threshold" className="text-right">
                Reorder Threshold
              </Label>
              <Input
                id="reorder_threshold"
                type="number"
                value={productForm.reorder_threshold}
                onChange={(e) => setProductForm({ ...productForm, reorder_threshold: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reorder_quantity" className="text-right">
                Reorder Quantity
              </Label>
              <Input
                id="reorder_quantity"
                type="number"
                value={productForm.reorder_quantity}
                onChange={(e) => setProductForm({ ...productForm, reorder_quantity: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost_price" className="text-right">
                Cost Price
              </Label>
              <Input
                id="cost_price"
                type="number"
                value={productForm.cost_price}
                onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="selling_price" className="text-right">
                Selling Price
              </Label>
              <Input
                id="selling_price"
                type="number"
                value={productForm.selling_price}
                onChange={(e) => setProductForm({ ...productForm, selling_price: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAddProduct} className="w-full">Add Product</Button>
        </DialogContent>
      </Dialog>

      {/* Create Purchase Order Dialog */}
      <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier_id_order" className="text-right">
                Supplier
              </Label>
                             <Select onValueChange={(value) => setOrderForm({ ...orderForm, supplier_id: value })} defaultValue={orderForm.supplier_id}>
                 <SelectTrigger className="col-span-3">
                   <SelectValue placeholder="Select a supplier" />
                 </SelectTrigger>
                 <SelectContent>
                   {suppliers.map((supplier) => (
                     <SelectItem key={supplier.supplier_id} value={supplier.supplier_id}>
                       {supplier.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expected_delivery_date" className="text-right">
                Expected Delivery Date
              </Label>
              <Input
                id="expected_delivery_date"
                type="date"
                value={orderForm.expected_delivery_date}
                onChange={(e) => setOrderForm({ ...orderForm, expected_delivery_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={orderForm.notes}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order_items" className="text-right">
                Items
              </Label>
              <div className="col-span-3 space-y-2">
                {orderForm.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 items-center gap-4">
                    <Input
                      type="hidden"
                      value={item.product_id}
                      onChange={(e) => {
                        const newItems = [...orderForm.items];
                        newItems[index] = { ...newItems[index], product_id: e.target.value };
                        setOrderForm({ ...orderForm, items: newItems });
                      }}
                    />
                    <Label htmlFor={`item_quantity_${index}`} className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id={`item_quantity_${index}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...orderForm.items];
                        newItems[index] = { ...newItems[index], quantity: e.target.value };
                        setOrderForm({ ...orderForm, items: newItems });
                      }}
                      className="col-span-1"
                    />
                    <Label htmlFor={`item_unit_price_${index}`} className="text-right">
                      Unit Price
                    </Label>
                    <Input
                      id={`item_unit_price_${index}`}
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => {
                        const newItems = [...orderForm.items];
                        newItems[index] = { ...newItems[index], unit_price: e.target.value };
                        setOrderForm({ ...orderForm, items: newItems });
                      }}
                      className="col-span-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newItems = [...orderForm.items];
                        newItems.splice(index, 1);
                        setOrderForm({ ...orderForm, items: newItems });
                      }}
                      className="col-span-1"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newItems = [...orderForm.items];
                        newItems.push({ product_id: '', quantity: '', unit_price: '' });
                        setOrderForm({ ...orderForm, items: newItems });
                      }}
                      className="col-span-1"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button onClick={handleCreateOrder} className="w-full">Create Order</Button>
        </DialogContent>
      </Dialog>

             {/* View Alerts Dialog */}
       <Dialog open={isViewAlertsOpen} onOpenChange={setIsViewAlertsOpen}>
         <DialogContent className="max-w-4xl">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <Bell className="h-5 w-5 text-warning" />
               System Alerts
             </DialogTitle>
           </DialogHeader>
           <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
             {loadingAlerts ? (
               <p>Loading alerts...</p>
             ) : alerts.length === 0 ? (
               <div className="text-center py-8">
                 <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                 <p className="text-muted-foreground">No active alerts at the moment.</p>
                 <p className="text-sm text-muted-foreground">Your inventory system is running smoothly!</p>
               </div>
             ) : (
               alerts.map((alert, index) => (
                 <Card key={index} className="p-4">
                   <div className="flex items-start justify-between">
                     <div className="flex items-start gap-3">
                       <div className={`w-3 h-3 rounded-full mt-1 ${
                         alert.severity === 'critical' ? 'bg-red-500' :
                         alert.severity === 'high' ? 'bg-orange-500' :
                         alert.severity === 'medium' ? 'bg-yellow-500' :
                         'bg-blue-500'
                       }`} />
                       <div>
                         <h4 className="font-semibold">{alert.title}</h4>
                         <p className="text-sm text-muted-foreground">{alert.message}</p>
                         <div className="flex items-center gap-2 mt-2">
                           <Badge variant="outline" className="text-xs">
                             {alert.type}
                           </Badge>
                           <Badge variant="outline" className="text-xs">
                             {alert.severity}
                           </Badge>
                           <span className="text-xs text-muted-foreground">
                             {new Date(alert.created_at).toLocaleDateString()}
                           </span>
                         </div>
                       </div>
                     </div>
                     <Badge className={
                       alert.status === 'active' ? 'bg-red-100 text-red-800' :
                       alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                       'bg-green-100 text-green-800'
                     }>
                       {alert.status}
                     </Badge>
                   </div>
                 </Card>
               ))
             )}
           </div>
         </DialogContent>
       </Dialog>

             {/* Run Report Dialog */}
       <Dialog open={isRunReportOpen} onOpenChange={setIsRunReportOpen}>
         <DialogContent className="max-w-4xl">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <BarChart3 className="h-5 w-5 text-success" />
               Inventory Reports
             </DialogTitle>
           </DialogHeader>
           <div className="grid gap-6 py-4">
             {/* Basic Statistics */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Card className="p-4">
                 <div className="flex items-center gap-2 mb-2">
                   <Package className="h-4 w-4 text-primary" />
                   <h4 className="font-semibold">Total Products</h4>
                 </div>
                 <p className="text-2xl font-bold">{products.length}</p>
                 <p className="text-sm text-muted-foreground">Active products in inventory</p>
               </Card>
               
               <Card className="p-4">
                 <div className="flex items-center gap-2 mb-2">
                   <AlertTriangle className="h-4 w-4 text-warning" />
                   <h4 className="font-semibold">Low Stock Items</h4>
                 </div>
                 <p className="text-2xl font-bold text-warning">
                   {products.filter(p => p.current_stock <= p.reorder_threshold).length}
                 </p>
                 <p className="text-sm text-muted-foreground">Products below threshold</p>
               </Card>
               
               <Card className="p-4">
                 <div className="flex items-center gap-2 mb-2">
                   <DollarSign className="h-4 w-4 text-success" />
                   <h4 className="font-semibold">Total Inventory Value</h4>
                 </div>
                 <p className="text-2xl font-bold text-success">
                   ${products.reduce((sum, p) => sum + (p.current_stock * p.cost_price || 0), 0).toLocaleString()}
                 </p>
                 <p className="text-sm text-muted-foreground">Based on cost price</p>
               </Card>
             </div>

             {/* Low Stock Products */}
             <div>
               <h4 className="font-semibold mb-3 flex items-center gap-2">
                 <AlertTriangle className="h-4 w-4 text-warning" />
                 Low Stock Alert Report
               </h4>
               <div className="space-y-2 max-h-64 overflow-y-auto">
                 {products.filter(p => p.current_stock <= p.reorder_threshold).length === 0 ? (
                   <p className="text-muted-foreground">All products are sufficiently stocked.</p>
                 ) : (
                   products
                     .filter(p => p.current_stock <= p.reorder_threshold)
                     .map((product, index) => (
                       <Card key={index} className="p-3">
                         <div className="flex justify-between items-center">
                           <div>
                             <h5 className="font-medium">{product.name}</h5>
                             <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-sm">
                               <span className="font-medium text-warning">{product.current_stock}</span>
                               <span className="text-muted-foreground"> / {product.reorder_threshold} threshold</span>
                             </p>
                             <Badge className="bg-warning/10 text-warning border-warning">
                               Reorder Needed
                             </Badge>
                           </div>
                         </div>
                       </Card>
                     ))
                 )}
               </div>
             </div>

             {/* Category Breakdown */}
             <div>
               <h4 className="font-semibold mb-3 flex items-center gap-2">
                 <Package className="h-4 w-4 text-primary" />
                 Products by Category
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {Object.entries(
                   products.reduce((acc, product) => {
                     const category = product.category || 'Uncategorized';
                     acc[category] = (acc[category] || 0) + 1;
                     return acc;
                   }, {})
                 ).map(([category, count]) => (
                   <div key={category} className="flex justify-between items-center p-3 border rounded-lg">
                     <span className="font-medium">{category}</span>
                     <Badge variant="outline">{count} products</Badge>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         </DialogContent>
       </Dialog>

       {/* Analytics Dialog */}
       <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <BarChart3 className="h-5 w-5 text-primary" />
               Inventory Turnover Analysis
             </DialogTitle>
           </DialogHeader>
           <div className="space-y-6">
             {/* Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Card>
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm">Total Inventory Value</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-primary">
                     ${products.reduce((sum, p) => sum + ((p.current_stock || 0) * (p.cost_price || 0)), 0).toLocaleString()}
                   </div>
                   <p className="text-xs text-muted-foreground">Current stock valuation</p>
                 </CardContent>
               </Card>
               
               <Card>
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm">Slow Moving Items</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-warning">
                     {products.filter(p => (p.current_stock || 0) > (p.reorder_threshold || 0) * 2).length}
                   </div>
                   <p className="text-xs text-muted-foreground">Items with high stock levels</p>
                 </CardContent>
               </Card>
               
               <Card>
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm">Optimal Stock Items</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-success">
                     {products.filter(p => {
                       const stock = p.current_stock || 0;
                       const threshold = p.reorder_threshold || 0;
                       return stock > threshold && stock <= threshold * 2;
                     }).length}
                   </div>
                   <p className="text-xs text-muted-foreground">Well-balanced inventory</p>
                 </CardContent>
               </Card>
             </div>

             {/* Detailed Analysis */}
             <div className="space-y-4">
               <h3 className="text-lg font-semibold">Product Analysis</h3>
               <div className="space-y-3 max-h-60 overflow-y-auto">
                 {products.map((product, index) => {
                   const stock = product.current_stock || 0;
                   const threshold = product.reorder_threshold || 0;
                   const value = stock * (product.cost_price || 0);
                   
                   let status = "optimal";
                   let statusColor = "text-success";
                   let recommendation = "Stock levels are well balanced";
                   
                   if (stock <= threshold) {
                     status = "low";
                     statusColor = "text-destructive";
                     recommendation = "Reorder immediately";
                   } else if (stock > threshold * 2) {
                     status = "excess";
                     statusColor = "text-warning";
                     recommendation = "Consider reducing order quantities";
                   }
                   
                   return (
                     <div key={index} className="p-3 border rounded-lg">
                       <div className="flex justify-between items-start mb-2">
                         <div>
                           <h4 className="font-medium">{product.name || 'Unknown Product'}</h4>
                           <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                         </div>
                         <Badge className={status === "low" ? "status-danger" : status === "excess" ? "status-warning" : "status-success"}>
                           {status}
                         </Badge>
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                         <div>
                           <span className="text-muted-foreground">Stock:</span>
                           <span className={`ml-1 font-medium ${statusColor}`}>{stock}</span>
                         </div>
                         <div>
                           <span className="text-muted-foreground">Threshold:</span>
                           <span className="ml-1 font-medium">{threshold}</span>
                         </div>
                         <div>
                           <span className="text-muted-foreground">Value:</span>
                           <span className="ml-1 font-medium">${value.toFixed(2)}</span>
                         </div>
                         <div>
                           <span className="text-muted-foreground">Status:</span>
                           <span className={`ml-1 font-medium ${statusColor}`}>{recommendation}</span>
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>
           </div>
         </DialogContent>
       </Dialog>
    </div>
  );
};

export default Dashboard;