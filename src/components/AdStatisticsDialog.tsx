import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Building2, 
  Globe,
  User,
  Flag,
  BarChart3,
  Target
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
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Statystyki reklamy
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{pageName}</p>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="px-6 pb-6 space-y-4">
            {/* Key Metrics Section */}
            {(data.eu_total_reach !== undefined || data.target_gender || data.target_locations) && (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  {data.eu_total_reach !== undefined && (
                    <Card className="border-primary/20">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Zasięg</p>
                            <p className="text-xl font-bold text-primary">
                              {data.eu_total_reach.toLocaleString('pl-PL')}
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-primary/20" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {data.target_gender && (
                    <Card className="border-secondary/20">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Płeć docelowa</p>
                            {getGenderBadge(data.target_gender)}
                          </div>
                          <Users className="w-8 h-8 text-secondary/20" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {data.target_locations && (
                    <Card className="border-accent/20">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Lokalizacje</p>
                            <p className="text-xl font-bold text-accent">
                              {data.target_locations.length}
                            </p>
                          </div>
                          <Target className="w-8 h-8 text-accent/20" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {(data.target_locations || data.age_country_gender_reach_breakdown || data.total_reach_by_location || data.beneficiary_payers) && (
                  <Separator className="my-4" />
                )}
              </>
            )}

            {/* Target Locations */}
            {data.target_locations && data.target_locations.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  Lokalizacje targetowania
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {data.target_locations.map((location, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2.5 rounded-lg border bg-card/50 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Flag className="w-3 h-3 text-muted-foreground" />
                        <span className="font-medium">{location.name}</span>
                        <Badge variant="outline" className="text-xs py-0 h-5">
                          {location.type}
                        </Badge>
                      </div>
                      {location.excluded && (
                        <Badge variant="destructive" className="text-xs py-0 h-5">
                          Wykluczona
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Demographics Chart */}
            {data.age_country_gender_reach_breakdown && demographicData.length > 0 && (
              <>
                {(data.target_locations || data.beneficiary_payers || data.total_reach_by_location) && (
                  <Separator className="my-4" />
                )}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="w-4 h-4 text-secondary" />
                    Demografia
                  </div>
                  <Card className="border-secondary/20">
                    <CardContent className="pt-4">
                      <ResponsiveContainer width="100%" height={250}>
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
                </div>
              </>
            )}

            {/* Reach by Location */}
            {data.total_reach_by_location && data.total_reach_by_location.length > 0 && (
              <>
                {(data.target_locations || data.age_country_gender_reach_breakdown || data.beneficiary_payers) && (
                  <Separator className="my-4" />
                )}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Globe className="w-4 h-4 text-accent" />
                    Rozkład zasięgu
                  </div>
                  <div className="grid gap-2">
                    {data.total_reach_by_location.map((item, index) => {
                      const total = data.total_reach_by_location!.reduce((sum, i) => sum + i.value, 0);
                      const percentage = ((item.value / total) * 100).toFixed(1);
                      
                      return (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2.5 rounded-lg border bg-card/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.key}</span>
                            <Badge variant="outline" className="text-xs py-0 h-5">
                              {percentage}%
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.value.toLocaleString('pl-PL')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Payer Information */}
            {data.beneficiary_payers && data.beneficiary_payers.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="w-4 h-4 text-primary" />
                    Płatnik
                  </div>
                  {data.beneficiary_payers.map((item, index) => (
                    <Card key={index} className="border-primary/20">
                      <CardContent className="pt-4 pb-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Płatnik:</span>
                          <span className="font-medium">{item.payer}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Beneficjent:</span>
                          <span className="font-medium">{item.beneficiary}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}