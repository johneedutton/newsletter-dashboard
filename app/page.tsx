'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Newspaper, DollarSign, TrendingUp, Search, Trash2, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newslettersResponse, recommendationsResponse] = await Promise.all([
          fetch('/api/newsletters'),
          fetch('/api/recommendations')
        ]);
        
        const newslettersData = await newslettersResponse.json();
        const recommendationsData = await recommendationsResponse.json();
        
        setNewsletters(newslettersData);
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/newsletters/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete newsletter');
      
      setNewsletters(newsletters.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting newsletter:', error);
    }
  };

  const filteredNewsletters = newsletters.filter(newsletter =>
    newsletter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsletter.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpend = newsletters
    .filter(n => n.paid)
    .reduce((sum, n) => sum + (n.cost || 0), 0);
  
  const lowEngagementPaid = newsletters
    .filter(n => n.paid && n.engagement < 0.5)
    .length;
  
  const highEngagementFree = newsletters
    .filter(n => !n.paid && n.engagement > 0.8)
    .length;

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Newsletter Dashboard</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              Add Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Newsletter</DialogTitle>
            </DialogHeader>
            <AddNewsletterForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpend.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Engagement Paid</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowEngagementPaid}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Engagement Free</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highEngagementFree}</div>
          </CardContent>
        </Card>
      </div>
      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Recommended Newsletters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map(recommendation => (
              <div key={recommendation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-medium">{recommendation.name}</div>
                  <div className="text-sm text-muted-foreground">by {recommendation.author}</div>
                  <div className="mt-1">
                    <Badge variant="outline">{recommendation.category}</Badge>
                    {recommendation.price && (
                      <Badge variant="secondary" className="ml-2">
                        ${recommendation.price}/mo
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    {recommendation.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm font-medium text-green-600">
                    {(recommendation.matchScore * 100).toFixed(0)}% match
                  </div>
                  {recommendation.subscribers && (
                    <div className="text-sm text-muted-foreground">
                      {recommendation.subscribers.toLocaleString()} subscribers
                    </div>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => recommendation.url && window.open(recommendation.url, '_blank')}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Newsletters</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search newsletters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNewsletters.map(newsletter => (
              <div key={newsletter.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{newsletter.name}</div>
                  <div className="text-sm text-muted-foreground">by {newsletter.author}</div>
                  <div className="mt-1">
                    <Badge variant={newsletter.paid ? "default" : "secondary"}>
                      {newsletter.paid ? "Paid" : "Free"}
                    </Badge>
                    <Badge variant="outline" className="ml-2">{newsletter.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {newsletter.paid && <div className="font-medium">${newsletter.cost}/mo</div>}
                    <div className={`text-sm ${
                      newsletter.engagement > 0.7 ? "text-green-600" :
                      newsletter.engagement < 0.5 ? "text-red-600" :
                      "text-yellow-600"
                    }`}>
                      {(newsletter.engagement * 100).toFixed(0)}% engagement
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(newsletter.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
