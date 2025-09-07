import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Building2, 
  Globe,
  User,
  Flag,
  BarChart3
} from 'lucide-react';
import { AdBasicInfo } from '@/types/ad.types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdStatisticsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data?: AdBasicInfo;
  pageName: string;
}

export default function AdStatisticsDialog({ 
  isOpen, 
  onClose, 
  data,
  pageName
}: AdStatisticsDialogProps) {
  if (!data) return null;

  const hasStatistics = data.target_gender || 
    data.target_locations || 
    data.eu_total_reach || 
    data.beneficiary_payers ||
    data.age_country_gender_reach_breakdown;

  if (!hasStatistics) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Statystyki reklamy</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">
              Brak dostępnych danych statystycznych dla tej reklamy
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Prepare demographic chart data
  const demographicData = data.age_country_gender_reach_breakdown?.flatMap(country => 
    country.age_gender_breakdowns.map(breakdown => ({
      age: breakdown.age_range,
      country: country.country,
      Mężczyźni: breakdown.male,
      Kobiety: breakdown.female,
      Nieznane: breakdown.unknown
    }))
  ) || [];

  // Prepare reach by location data for pie chart
  const reachData = data.total_reach_by_location?.map(item => ({
    name: item.key,
    value: item.value
  })) || [];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const getGenderBadge = (gender?: string) => {
    if (!gender) return null;
    
    const genderMap: Record<string, { label: string; icon: JSX.Element; className: string }> = {
      'All': { label: 'Wszyscy', icon: <Users className="w-3 h-3" />, className: 'border-accent/20' },
      'Men': { label: 'Mężczyźni', icon: <User className="w-3 h-3" />, className: 'border-primary/20' },
      'Women': { label: 'Kobiety', icon: <User className="w-3 h-3" />, className: 'border-secondary/20' }
    };

    const config = genderMap[gender] || genderMap['All'];
    
    return (
      <Badge variant="outline" className={`${config.className} gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Statystyki reklamy - {pageName}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start px-6 rounded-none border-b bg-background">
            <TabsTrigger value="general">Ogólne</TabsTrigger>
            {data.target_locations && <TabsTrigger value="targeting">Targetowanie</TabsTrigger>}
            {data.age_country_gender_reach_breakdown && <TabsTrigger value="demographics">Demografia</TabsTrigger>}
            {data.total_reach_by_location && <TabsTrigger value="reach">Zasięg</TabsTrigger>}
            {data.beneficiary_payers && <TabsTrigger value="payer">Płatnik</TabsTrigger>}
          </TabsList>

          <ScrollArea className="h-[calc(90vh-140px)]">
            <div className="p-6">
              <TabsContent value="general" className="mt-0 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {data.target_gender && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Płeć docelowa</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {getGenderBadge(data.target_gender)}
                      </CardContent>
                    </Card>
                  )}
                  
                  {data.eu_total_reach !== undefined && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Globe className="w-4 h-4 text-accent" />
                          Zasięg w UE
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">
                          {data.eu_total_reach.toLocaleString('pl-PL')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          szacowany całkowity zasięg
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {data.target_locations && (
                <TabsContent value="targeting" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Lokalizacje targetowania
                      </CardTitle>
                      <CardDescription>
                        Lista krajów i regionów objętych kampanią
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {data.target_locations.map((location, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                          >
                            <div className="flex items-center gap-2">
                              <Flag className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{location.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {location.type}
                              </Badge>
                            </div>
                            {location.excluded && (
                              <Badge variant="destructive" className="text-xs">
                                Wykluczona
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {data.age_country_gender_reach_breakdown && demographicData.length > 0 && (
                <TabsContent value="demographics" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary" />
                        Rozbicie demograficzne
                      </CardTitle>
                      <CardDescription>
                        Zasięg według wieku i płci w poszczególnych krajach
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={demographicData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="age" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="Mężczyźni" fill="hsl(var(--primary))" />
                          <Bar dataKey="Kobiety" fill="hsl(var(--secondary))" />
                          <Bar dataKey="Nieznane" fill="hsl(var(--muted))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {data.total_reach_by_location && reachData.length > 0 && (
                <TabsContent value="reach" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        Zasięg według lokalizacji
                      </CardTitle>
                      <CardDescription>
                        Rozkład zasięgu w poszczególnych regionach
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={reachData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="hsl(var(--primary))"
                            dataKey="value"
                          >
                            {reachData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="mt-4 space-y-2">
                        {data.total_reach_by_location.map((item, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg border"
                          >
                            <span className="text-sm font-medium">{item.key}</span>
                            <Badge variant="outline">
                              {item.value.toLocaleString('pl-PL')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {data.beneficiary_payers && (
                <TabsContent value="payer" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        Informacje o płatniku
                      </CardTitle>
                      <CardDescription>
                        Kto faktycznie opłaca kampanię reklamową
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.beneficiary_payers.map((item, index) => (
                          <div 
                            key={index}
                            className="p-4 rounded-lg border bg-card space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Płatnik:</span>
                              <span className="font-medium">{item.payer}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Beneficjent:</span>
                              <span className="font-medium">{item.beneficiary}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}