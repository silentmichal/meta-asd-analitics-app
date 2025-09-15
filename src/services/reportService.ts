import { AdData } from '@/types/ad.types';
import { StrategicReportData } from '@/types/strategic-report.types';
import { sendReportData } from './adService';

// Generate strategic report by sending data to API and processing response
export async function generateStrategicReport(ads: AdData[]): Promise<StrategicReportData> {
  try {
    // Send data to API and get response
    const apiResponse = await sendReportData(ads);
    
    // If the API response is already in the correct format, return it
    if (apiResponse && isValidReportData(apiResponse)) {
      return apiResponse as StrategicReportData;
    }
    
    // If API response needs transformation, transform it here
    // This is a placeholder for potential data transformation
    const transformedData = transformApiResponse(apiResponse);
    
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
  // This function would handle any necessary transformation
  // from the API response format to our internal format
  // For now, we'll assume the API returns the correct format
  
  // Fallback to a minimal valid structure if needed
  if (!apiResponse) {
    throw new Error('Invalid API response');
  }
  
  // Return the response as is if it appears to be valid
  return apiResponse;
}