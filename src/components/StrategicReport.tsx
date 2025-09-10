import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
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
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Szacowany Zasięg' },
      },
      x: {
        title: { display: true, text: 'Przedziały Wiekowe' },
      },
    },
  };

  const formatChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
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
        return '🚀';
      case 'exploit':
        return '💡';
      case 'test':
        return '🧪';
      default:
        return '📊';
    }
  };

  const getPlayColor = (type: string) => {
    switch (type) {
      case 'adapt':
        return 'text-green-600';
      case 'exploit':
        return 'text-blue-600';
      case 'test':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="text-xl font-bold mb-1">Główny Rynek</h3>
                <p className="text-2xl font-semibold text-primary">
                  {data.customerProfile.demographics.mainLocation}
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🚻</div>
                <h3 className="text-xl font-bold mb-1">Dominująca Płeć</h3>
                <p className="text-2xl font-semibold text-primary">
                  {data.customerProfile.demographics.dominantGender}
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-xl font-bold mb-1">Szacowany Zasięg (UE)</h3>
                <p className="text-2xl font-semibold text-primary">
                  {data.customerProfile.demographics.totalReachEU.toLocaleString('pl-PL')}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Podział Zasięgu Reklam wg Wieku i Płci
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Bar
                  data={data.customerProfile.demographics.chartData}
                  options={chartOptions}
                />
              </div>
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-lg font-bold mb-2">Wniosek Analityczny:</h4>
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
                
                <div className="mt-6 pt-6 border-t">
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
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-lg font-bold mb-2">Wniosek Analityczny:</h4>
                  <p className="text-muted-foreground">
                    {data.messagingAnatomy.visuals.analysis}
                  </p>
                </div>
              </CardContent>
            </Card>
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

        {/* Tactical Playbook */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            Playbook Taktyczny: Co Powinieneś Zrobić?
          </h2>
          
          <div className="space-y-6">
            {data.tacticalPlaybook.map((play, idx) => (
              <Card
                key={idx}
                className="transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <h3 className={`text-xl font-bold mb-2 ${getPlayColor(play.type)}`}>
                    {getPlayIcon(play.type)} Play #{idx + 1}: {play.title}
                  </h3>
                  <p className="text-muted-foreground">{play.recommendation}</p>
                </CardContent>
              </Card>
            ))}
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