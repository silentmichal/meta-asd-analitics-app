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
    data.messagingAnatomy &&
    data.keyMetrics
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
  
  // Return the transformed response
  return transformedData;
}