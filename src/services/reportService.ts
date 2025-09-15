import { AdData } from '@/types/ad.types';
import { StrategicReportData } from '@/types/strategic-report.types';
import { sendReportData } from './adService';

// Generate strategic report by sending data to API and processing response
export async function generateStrategicReport(ads: AdData[]): Promise<StrategicReportData> {
  try {
    // Send data to API and get response
    const apiResponse = await sendReportData(ads);
    
    // Handle array response structure from API
    let reportData;
    if (Array.isArray(apiResponse) && apiResponse.length > 0 && apiResponse[0].output) {
      reportData = apiResponse[0].output;
    } else if (apiResponse && !Array.isArray(apiResponse)) {
      reportData = apiResponse;
    } else {
      throw new Error('Invalid API response structure');
    }
    
    // If the API response is already in the correct format, return it
    if (reportData && isValidReportData(reportData)) {
      return transformApiResponse(reportData);
    }
    
    // If API response needs transformation, transform it here
    const transformedData = transformApiResponse(reportData);
    
    return transformedData;
  } catch (error) {
    console.error('Error generating strategic report:', error);
    throw error;
  }
}

// Validate if the response has the expected structure
function isValidReportData(data: any): boolean {
  return (
    data &&
    data.reportMetadata &&
    data.executiveSummary &&
    data.customerJourney &&
    data.customerProfile &&
    data.messagingAnatomy
  );
}

// Transform API response to match StrategicReportData structure
function transformApiResponse(apiResponse: any): StrategicReportData {
  // Handle transformation of specific fields
  const transformedData = { ...apiResponse };
  
  // Transform formatsChartData from API format to expected format
  if (transformedData.distributionAndFormats?.formatsChartData) {
    transformedData.distributionAndFormats.formatsChartData = 
      transformedData.distributionAndFormats.formatsChartData.map((item: any) => ({
        label: item.format || item.label,
        value: item.percentage || item.value
      }));
  }
  
  // Fix the customerJourney field casing (toFu -> ToFu, etc.)
  if (transformedData.customerJourney) {
    const journey = transformedData.customerJourney;
    transformedData.customerJourney = {
      ToFu: journey.toFu || journey.ToFu || { usedTools: [], mainMessage: null },
      MoFu: journey.moFu || journey.MoFu || { usedTools: [], mainMessage: null },
      BoFu: journey.boFu || journey.BoFu || { usedTools: [], mainMessage: null }
    };
  }
  
  // Transform tacticalPlaybook from API format (type/recommendation) to expected format (playName/description)
  if (transformedData.tacticalPlaybook && Array.isArray(transformedData.tacticalPlaybook)) {
    transformedData.tacticalPlaybook = transformedData.tacticalPlaybook.map((play: any) => ({
      playName: play.type || play.playName || 'test',
      description: play.recommendation || play.description || ''
    }));
  }
  
  // Transform colorPalette from array of strings to array of objects
  if (transformedData.messagingAnatomy?.visuals?.colorPalette) {
    const palette = transformedData.messagingAnatomy.visuals.colorPalette;
    if (Array.isArray(palette) && palette.length > 0 && typeof palette[0] === 'string') {
      transformedData.messagingAnatomy.visuals.colorPalette = palette.map((color: string) => ({
        hex: color,
        name: getColorName(color)
      }));
    }
  }
  
  // Generate keyMetrics from available data or provide defaults
  if (!transformedData.keyMetrics) {
    transformedData.keyMetrics = {
      dominantAgeGroup: extractDominantAgeGroup(transformedData),
      dominantGender: transformedData.customerProfile?.demographics?.dominantGender || 'All',
      mainGoal: extractMainGoal(transformedData),
      mostUsedFormat: extractMostUsedFormat(transformedData)
    };
  }
  
  // Return the transformed response
  return transformedData;
}

// Helper function to get color name from hex
function getColorName(hex: string): string {
  const colorMap: { [key: string]: string } = {
    '#0d131f': 'Ciemny granat',
    '#feda01': 'Żółty',
    '#ffffff': 'Biały',
    '#000000': 'Czarny',
    '#ff0000': 'Czerwony',
    '#00ff00': 'Zielony',
    '#0000ff': 'Niebieski'
  };
  return colorMap[hex.toLowerCase()] || 'Kolor niestandardowy';
}

// Helper function to extract dominant age group from demographics
function extractDominantAgeGroup(data: any): string {
  if (!data.customerProfile?.demographics?.chartData) return '25-34';
  
  const chartData = data.customerProfile.demographics.chartData;
  if (!chartData.labels || !chartData.datasets) return '25-34';
  
  let maxValue = 0;
  let dominantGroup = '25-34';
  
  chartData.labels.forEach((label: string, index: number) => {
    let totalForAge = 0;
    chartData.datasets.forEach((dataset: any) => {
      if (dataset.data && dataset.data[index]) {
        totalForAge += dataset.data[index];
      }
    });
    
    if (totalForAge > maxValue) {
      maxValue = totalForAge;
      dominantGroup = label;
    }
  });
  
  return dominantGroup;
}

// Helper function to extract main goal from executive summary
function extractMainGoal(data: any): string {
  if (data.executiveSummary?.businessModel) {
    if (data.executiveSummary.businessModel.toLowerCase().includes('lead')) {
      return 'Lead Generation';
    }
    if (data.executiveSummary.businessModel.toLowerCase().includes('sprzedaż')) {
      return 'Sprzedaż';
    }
    if (data.executiveSummary.businessModel.toLowerCase().includes('brand')) {
      return 'Brand Awareness';
    }
  }
  return 'Lead Generation';
}

// Helper function to extract most used format
function extractMostUsedFormat(data: any): string {
  if (!data.distributionAndFormats?.formatsChartData) return 'Image';
  
  const formats = data.distributionAndFormats.formatsChartData;
  if (!Array.isArray(formats) || formats.length === 0) return 'Image';
  
  let maxFormat = formats[0];
  formats.forEach((format: any) => {
    const currentValue = format.value || format.percentage || 0;
    const maxValue = maxFormat.value || maxFormat.percentage || 0;
    if (currentValue > maxValue) {
      maxFormat = format;
    }
  });
  
  return maxFormat.label || maxFormat.format || 'Image';
}