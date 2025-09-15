import { useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  TrendingUp, 
  Video, 
  ExternalLink,
  Lightbulb,
  Search,
  Rocket,
  Zap,
  TestTube,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StrategicReportData } from '@/types/strategic-report.types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StrategicReportProps {
  data: StrategicReportData;
  onBack: () => void;
}

const StrategicReport = ({ data, onBack }: StrategicReportProps) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Szacowany Zasięg', font: { size: 14 } },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        title: { display: true, text: 'Przedziały Wiekowe', font: { size: 14 } },
        grid: {
          display: false,
        },
      },
    },
  };

  const formatChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 15,
          font: {
            size: 13,
          },
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels && data.datasets && data.datasets[0]) {
              const dataset = data.datasets[0];
              const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
              return data.labels.map((label: string, i: number) => {
                const value = dataset.data[i];
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  const formatChartData = {
    labels: data.distributionAndFormats.formatsChartData.labels,
    datasets: [
      {
        data: data.distributionAndFormats.formatsChartData.data,
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
          'hsl(var(--accent))',
          'hsl(var(--muted))',
        ],
        borderWidth: 1,
      },
    ],
  };

  const getPlayIcon = (type: string) => {
    switch (type) {
      case 'adapt':
        return Rocket;
      case 'exploit':
        return Lightbulb;
      case 'test':
        return TestTube;
      default:
        return BarChart3;
    }
  };

  const getPlayColor = (type: string) => {
    switch (type) {
      case 'adapt':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'exploit':
        return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'test':
        return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      default:
        return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b py-10">
        <div className="max-w-7xl mx-auto px-6">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do dashboardu
          </Button>
          
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Raport Strategiczny
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black">
              Głęboka Analiza Konkurencji
            </h1>
            <p className="text-lg text-muted-foreground mt-4">
              Automatyczne wnioski dla:{' '}
              <span className="font-bold text-foreground">
                {data.reportMetadata.analyzedCompanyName}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Data analizy: {data.reportMetadata.analysisDate}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* KPI Dashboard */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden hover:scale-105 transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Grupa Wiekowa</p>
                    <p className="text-2xl font-bold mt-2">{data.keyMetrics.dominantAgeGroup}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:scale-105 transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dominująca Płeć</p>
                    <p className="text-2xl font-bold mt-2">{data.keyMetrics.dominantGender}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-secondary/50" />
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:scale-105 transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Główny Cel</p>
                    <p className="text-2xl font-bold mt-2">{data.keyMetrics.mainGoal}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/50" />
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:scale-105 transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Format Reklam</p>
                    <p className="text-2xl font-bold mt-2">{data.keyMetrics.mostUsedFormat}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-muted/30 flex items-center justify-center">
                    <Video className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-muted-foreground to-muted-foreground/50" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Executive Summary */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            Podsumowanie dla Zarządu
          </h2>
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-background">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed">
                Analiza reklam firmy{' '}
                <strong>{data.reportMetadata.analyzedCompanyName}</strong>{' '}
                wskazuje na precyzyjnie stargetowaną strategię, której celem jest
                dotarcie do{' '}
                <strong className="text-primary">
                  {data.executiveSummary.mainDemographic}
                </strong>
                . Ich kluczową siłą jest{' '}
                <strong>{data.executiveSummary.competitorStrength}</strong>, co
                widać w copywritingu oraz spójnej komunikacji wizualnej. Dane
                jednoznacznie pokazują, że firma skupia swoje działania na rynku{' '}
                <strong className="text-primary">
                  {data.executiveSummary.mainMarket}
                </strong>
                , ignorując potencjał w innych segmentach. Naszą największą szansą
                jest zaadresowanie potrzeb{' '}
                <strong className="text-primary">
                  {data.executiveSummary.overlookedDemographic}
                </strong>{' '}
                oraz {data.executiveSummary.strategyGap}.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Demographics */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            Kto Jest Ich Klientem? Analiza Demograficzna
          </h2>
          

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Podział Zasięgu Reklam wg Wieku i Płci
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Bar
                  data={{
                    ...data.customerProfile.demographics.chartData,
                    datasets: data.customerProfile.demographics.chartData.datasets.map((dataset, idx) => ({
                      ...dataset,
                      backgroundColor: idx === 0 
                        ? 'rgba(59, 130, 246, 0.8)' // Blue for male
                        : idx === 1
                        ? 'rgba(147, 51, 234, 0.8)' // Purple for female
                        : 'rgba(156, 163, 175, 0.8)', // Gray for unknown
                      borderColor: idx === 0
                        ? 'rgba(59, 130, 246, 1)'
                        : idx === 1
                        ? 'rgba(147, 51, 234, 1)'
                        : 'rgba(156, 163, 175, 1)',
                      borderWidth: 2,
                      hoverBackgroundColor: idx === 0
                        ? 'rgba(59, 130, 246, 1)'
                        : idx === 1
                        ? 'rgba(147, 51, 234, 1)'
                        : 'rgba(156, 163, 175, 1)',
                    })),
                  }}
                  options={chartOptions}
                />
              </div>
              <div className="mt-6 pt-6 border-t border-l-4 border-l-primary bg-muted/20 rounded-r-lg p-4">
                <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Wniosek Analityczny:
                </h4>
                <p className="text-muted-foreground">
                  {data.customerProfile.demographics.analysis}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Messaging Anatomy */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            Anatomia Przekazu Reklamowego
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Komunikacja i Język</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Ton Głosu:</strong>{' '}
                  {data.messagingAnatomy.communication.toneOfVoice}
                </div>
                <div>
                  <strong>Dominujące Emocje:</strong>{' '}
                  {data.messagingAnatomy.communication.dominantEmotions.join(', ')}
                </div>
                <div>
                  <strong>Główne "Kąty" Sprzedażowe:</strong>{' '}
                  {data.messagingAnatomy.communication.salesAngles.join(', ')}
                </div>
                
                <div className="mt-6 pt-6 border-t border-l-4 border-l-primary bg-muted/20 rounded-r-lg p-4">
                  <h4 className="text-lg font-bold mb-2">Wniosek Analityczny:</h4>
                  <p className="text-muted-foreground">
                    {data.messagingAnatomy.communication.analysis}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Strategia Wizualna</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Dominujący Styl:</strong>{' '}
                  {data.messagingAnatomy.visuals.dominantStyle}
                </div>
                <div>
                  <strong>Najczęstsze Elementy:</strong>{' '}
                  {data.messagingAnatomy.visuals.commonElements.join(', ')}
                </div>
                <div>
                  <strong>Paleta Kolorów:</strong>
                  <div className="flex gap-2 mt-2">
                    {data.messagingAnatomy.visuals.colorPalette.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-l-4 border-l-primary bg-muted/20 rounded-r-lg p-4">
                  <h4 className="text-lg font-bold mb-2">Wniosek Analityczny:</h4>
                  <p className="text-muted-foreground">
                    {data.messagingAnatomy.visuals.analysis}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Most Effective Ad Hooks */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            Najskuteczniejsze Haki Reklamowe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.adHooks.map((hook, idx) => (
              <Card 
                key={idx} 
                className="relative hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="absolute top-4 right-4">
                    <Lightbulb className="h-8 w-8 text-yellow-500/30" />
                  </div>
                  <blockquote className="text-lg md:text-xl font-semibold italic text-foreground/90 mb-6">
                    "{hook.hookText}"
                  </blockquote>
                  {hook.effectiveness && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                        <span>Skuteczność</span>
                        <span>{hook.effectiveness}/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(hook.effectiveness / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(hook.referenceUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Zobacz reklamę źródłową
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Distribution & Formats */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            Dystrybucja i Formaty
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Podział Formatów Reklam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-64">
                  <Doughnut data={formatChartData} options={formatChartOptions} />
                </div>
                <div className="flex items-center">
                  <div>
                    <h4 className="text-lg font-bold mb-2">Analiza Strategii Platform:</h4>
                    <p className="text-muted-foreground">
                      {data.distributionAndFormats.platformStrategyAnalysis}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Competitive Positioning */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            Pozycjonowanie Konkurencyjne i Twoja Szansa
          </h2>
          
          <div className="space-y-8">
            {data.competitiveOpportunities.map((opportunity, idx) => (
              <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={`${getPriorityColor(opportunity.priority)} border-2`}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Zidentyfikowana Słabość Konkurenta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{opportunity.weakness}</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-2 text-primary">
                      <Rocket className="h-5 w-5" />
                      Twoja Szansa / Rekomendacja Pozycjonowania
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium">{opportunity.recommendation}</p>
                    {opportunity.priority === 'high' && (
                      <Badge variant="destructive" className="mt-4">
                        Wysoki Priorytet
                      </Badge>
                    )}
                    {opportunity.priority === 'medium' && (
                      <Badge variant="secondary" className="mt-4">
                        Średni Priorytet
                      </Badge>
                    )}
                    {opportunity.priority === 'low' && (
                      <Badge variant="outline" className="mt-4">
                        Niski Priorytet
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Tactical Playbook */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            Playbook Taktyczny: Co Powinieneś Zrobić?
          </h2>
          
          <div className="space-y-6">
            {data.tacticalPlaybook.map((play, idx) => {
              const IconComponent = getPlayIcon(play.type);
              return (
                <Card
                  key={idx}
                  className={`transition-all hover:shadow-lg hover:-translate-y-1 border-2 ${getPlayColor(play.type)}`}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                      <IconComponent className="h-6 w-6" />
                      Play #{idx + 1}: {play.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{play.recommendation}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="bg-card border-t mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-muted-foreground">
          <p>© 2025 Raport wygenerowany automatycznie</p>
        </div>
      </footer>
    </div>
  );
};

export default StrategicReport;