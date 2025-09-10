import { StrategicReportData } from '@/types/strategic-report.types';
import { AdData } from '@/types/ad.types';

export const generateMockReportData = (ads: AdData[]): StrategicReportData => {
  // Extract company name from ads
  const companyName = ads[0]?.adData?.pageName || 'Analizowana Firma';
  const currentDate = new Date().toLocaleDateString('pl-PL');

  // Calculate demographics from ads
  const totalReach = ads.reduce((sum, ad) => {
    return sum + (ad.basic?.eu_total_reach || 0);
  }, 0);

  // Count ad types
  const adTypeCount = ads.reduce((acc, ad) => {
    acc[ad.adType] = (acc[ad.adType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate age and gender breakdown
  const ageGenderData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    datasets: [
      {
        label: 'Mężczyźni',
        data: [5184, 41909, 51161, 17064, 2452, 2162],
        backgroundColor: 'hsl(var(--primary))',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 1,
      },
      {
        label: 'Kobiety',
        data: [392, 3649, 4011, 1031, 191, 258],
        backgroundColor: 'hsl(var(--secondary))',
        borderColor: 'hsl(var(--secondary))',
        borderWidth: 1,
      },
      {
        label: 'Nieznana',
        data: [120, 890, 1200, 450, 80, 50],
        backgroundColor: 'hsl(var(--muted))',
        borderColor: 'hsl(var(--muted))',
        borderWidth: 1,
      },
    ],
  };

  return {
    reportMetadata: {
      analyzedCompanyName: companyName,
      analysisDate: currentDate,
    },
    executiveSummary: {
      mainDemographic: 'Mężczyzn w wieku 25-44 lat',
      mainMarket: 'Polska',
      overlookedDemographic: 'Kobiet w wieku 35-54 lat',
      businessModel: 'Model subskrypcyjny z naciskiem na retencję',
      mainCustomerProblem: 'Automatyzacja procesów biznesowych i oszczędność czasu',
      competitorStrength: 'dogłębne zrozumienie problemów grupy docelowej',
      strategyGap: 'zbudowanie bardziej osobistej, relacyjnej komunikacji',
    },
    customerJourney: {
      topOfFunnel: {
        usedTools: 'Reklamy wideo na Facebook i Instagram',
        mainMessage: 'Odkryj, jak zaoszczędzić 10 godzin tygodniowo',
      },
      middleOfFunnel: {
        usedTools: 'Remarketing z karuzelami produktowymi',
        mainMessage: 'Zobacz, jak inni już korzystają z naszego rozwiązania',
      },
      bottomOfFunnel: {
        usedTools: 'Dynamiczne reklamy produktowe (DPA)',
        mainMessage: 'Ostatnie sztuki w promocyjnej cenie - tylko dziś',
      },
    },
    customerProfile: {
      demographics: {
        mainLocation: 'Polska',
        dominantGender: 'Mężczyźni (92%)',
        totalReachEU: totalReach || 129464,
        chartData: ageGenderData,
        analysis:
          'Dane wyraźnie pokazują, że ponad 80% zasięgu reklamowego jest skoncentrowane na mężczyznach w grupach wiekowych 25-34 i 35-44. Kobiety oraz osoby w wieku 45+ stanowią marginalną część odbiorców, co wskazuje na wysoce wyspecjalizowane targetowanie lub potencjalną lukę rynkową.',
      },
      psychographics: {
        painsAndProblems: [
          'Brak czasu na rozwój biznesu',
          'Trudność w zarządzaniu wieloma projektami',
          'Frustracja związana z powtarzalnymi zadaniami',
        ],
        desiresAndGoals: [
          'Skalowanie biznesu bez zwiększania zespołu',
          'Więcej czasu na strategiczne decyzje',
          'Profesjonalny wizerunek w oczach klientów',
        ],
        offeredTransformation:
          'Od przytłoczonego przedsiębiorcy do zorganizowanego lidera rynku',
      },
    },
    messagingAnatomy: {
      communication: {
        toneOfVoice: 'Ekspercki i pewny siebie',
        dominantEmotions: [
          'Strach przed pozostaniem w tyle (FOMO)',
          'Duma z bycia profesjonalistą',
          'Ulga z automatyzacji',
        ],
        salesAngles: [
          'Oszczędność czasu jako główna wartość',
          'Social proof - inni już korzystają',
          'Ograniczona dostępność - pośpiech w decyzji',
        ],
        analysis:
          'Konkurent konsekwentnie używa eksperckiego tonu i odwołuje się do potrzeby bezpieczeństwa oraz strachu przed utratą konkurencyjności. Ich głównym argumentem sprzedażowym jest obietnica wysokiej jakości i zwrotu z inwestycji, a nie niska cena.',
      },
      visuals: {
        dominantStyle: 'Minimalistyczny i czysty',
        commonElements: [
          'Produkt w użyciu',
          'Infografiki z danymi',
          'Abstrakcyjne tła gradientowe',
        ],
        colorPalette: [
          { hex: '#4F46E5', name: 'Indigo' },
          { hex: '#FFFFFF', name: 'Biały' },
          { hex: '#1F2937', name: 'Ciemnoszary' },
        ],
        analysis:
          'Strategia wizualna jest spójna i oparta na minimalistycznym designie. Brak wizerunków ludzi sugeruje, że marka chce być postrzegana jako technologiczna i skoncentrowana na produkcie, a nie na relacjach międzyludzkich.',
      },
    },
    distributionAndFormats: {
      formatsChartData: {
        labels: Object.keys(adTypeCount),
        data: Object.values(adTypeCount),
      },
      platformStrategyAnalysis:
        `Analiza ${ads.length} reklam pokazuje dominację formatów ${Object.keys(adTypeCount).join(', ')}. ` +
        'Strategia dystrybucji koncentruje się głównie na platformach Meta (Facebook i Instagram), ' +
        'z wyraźnym naciskiem na formaty wizualne i interaktywne. Brak obecności na LinkedIn ' +
        'może oznaczać niewykorzystany potencjał w segmencie B2B.',
    },
    tacticalPlaybook: [
      {
        type: 'adapt',
        title: 'Zaadaptuj ich najsilniejszą taktykę',
        recommendation:
          'Konkurent skutecznie wykorzystuje karuzele produktowe do prezentacji różnych wariantów. ' +
          'Rekomendacja: Stwórz własne karuzele, ale z naciskiem na historie klientów i case studies. ' +
          'Wykorzystaj ich sprawdzoną strukturę, ale dodaj element ludzki, którego im brakuje.',
      },
      {
        type: 'exploit',
        title: 'Zaatakuj niedocenianą przez nich niszę',
        recommendation:
          'Dane demograficzne pokazują, że konkurent niemal całkowicie ignoruje segment kobiet w wieku 35-54. ' +
          'Rekomendacja: Przygotuj dedykowaną kampanię z językiem i wizualizacjami dopasowanymi do tej grupy. ' +
          'To rynek warty minimum 20% ich obecnego zasięgu, który możesz zdobyć bez bezpośredniej walki.',
      },
      {
        type: 'test',
        title: 'Przetestuj odmienną narrację emocjonalną',
        recommendation:
          'Ich komunikacja jest w dużej mierze oparta na logice i strachu (FOMO). ' +
          'Rekomendacja: Uruchom test A/B kampanii opartej na pozytywnych emocjach, aspiracjach i budowaniu społeczności. ' +
          'Pokaż "ludzką twarz" swojej marki i sprawdź, czy zbuduje to silniejszą więź z odbiorcami.',
      },
    ],
  };
};