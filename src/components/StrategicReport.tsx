import { useEffect, useRef, useState } from 'react';
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
  BarChart3,
  Megaphone,
  UserCheck,
  ShoppingCart,
  ArrowRight,
  Download,
  Mail,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Email validation schema
const emailSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email")
});

interface StrategicReportProps {
  data: StrategicReportData;
  onBack: () => void;
}

const StrategicReport = ({ data, onBack }: StrategicReportProps) => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    }
  });

  // Function to generate email-friendly HTML
  const generateEmailHTML = (): string => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px;">Raport Strategiczny</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">${data.reportMetadata.analyzedCompanyName}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Data analizy: ${data.reportMetadata.analysisDate}</p>
            </td>
          </tr>
          
          <!-- Key Metrics -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px;">Kluczowe Metryki</h2>
              <table width="100%" cellpadding="10" style="border-collapse: collapse;">
                <tr>
                  <td style="border: 1px solid #e5e5e5; padding: 15px; background: #f9f9f9;">
                    <strong>Grupa wiekowa:</strong> ${data.keyMetrics.dominantAgeGroup}
                  </td>
                  <td style="border: 1px solid #e5e5e5; padding: 15px; background: #f9f9f9;">
                    <strong>Płeć:</strong> ${data.keyMetrics.dominantGender}
                  </td>
                </tr>
                <tr>
                  <td style="border: 1px solid #e5e5e5; padding: 15px; background: #f9f9f9;">
                    <strong>Główny cel:</strong> ${data.keyMetrics.mainGoal}
                  </td>
                  <td style="border: 1px solid #e5e5e5; padding: 15px; background: #f9f9f9;">
                    <strong>Format reklam:</strong> ${data.keyMetrics.mostUsedFormat}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Executive Summary -->
          <tr>
            <td style="padding: 30px; background: #f0f4ff;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px;">Podsumowanie Wykonawcze</h2>
              <p style="line-height: 1.8; font-size: 16px;">
                Analiza reklam firmy <strong>${data.reportMetadata.analyzedCompanyName}</strong> 
                wskazuje na precyzyjnie stargetowaną strategię, której celem jest dotarcie do 
                <strong style="color: #667eea;">${data.executiveSummary.mainDemographic}</strong>. 
                Ich kluczową siłą jest <strong>${data.executiveSummary.competitorStrength}</strong>, 
                co widać w copywritingu oraz spójnej komunikacji wizualnej. Dane jednoznacznie pokazują, 
                że firma skupia swoje działania na rynku 
                <strong style="color: #667eea;">${data.executiveSummary.mainMarket}</strong>, 
                ignorując potencjał w innych segmentach. Naszą największą szansą jest zaadresowanie potrzeb 
                <strong style="color: #667eea;">${data.executiveSummary.overlookedDemographic}</strong> 
                oraz ${data.executiveSummary.strategyGap}.
              </p>
            </td>
          </tr>
          
          <!-- Customer Journey -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px;">Customer Journey</h2>
              
              <!-- ToFu -->
              <div style="margin-bottom: 20px; padding: 20px; border-left: 4px solid #3b82f6; background: #eff6ff;">
                <h3 style="color: #3b82f6; margin: 0 0 10px 0;">Top of Funnel (ToFu) - Świadomość</h3>
                <p><strong>Narzędzia:</strong> ${data.customerJourney.ToFu.usedTools.join(', ') || 'Brak danych'}</p>
                ${data.customerJourney.ToFu.mainMessage ? `<p><strong>Główny przekaz:</strong> "${data.customerJourney.ToFu.mainMessage}"</p>` : ''}
              </div>
              
              <!-- MoFu -->
              <div style="margin-bottom: 20px; padding: 20px; border-left: 4px solid #8b5cf6; background: #f3e8ff;">
                <h3 style="color: #8b5cf6; margin: 0 0 10px 0;">Middle of Funnel (MoFu) - Zainteresowanie</h3>
                <p><strong>Narzędzia:</strong> ${data.customerJourney.MoFu.usedTools.join(', ') || 'Brak danych'}</p>
                ${data.customerJourney.MoFu.mainMessage ? `<p><strong>Główny przekaz:</strong> "${data.customerJourney.MoFu.mainMessage}"</p>` : ''}
              </div>
              
              <!-- BoFu -->
              <div style="padding: 20px; border-left: 4px solid #10b981; background: #ecfdf5;">
                <h3 style="color: #10b981; margin: 0 0 10px 0;">Bottom of Funnel (BoFu) - Konwersja</h3>
                <p><strong>Narzędzia:</strong> ${data.customerJourney.BoFu.usedTools.join(', ') || 'Brak danych'}</p>
                ${data.customerJourney.BoFu.mainMessage ? `<p><strong>Główny przekaz:</strong> "${data.customerJourney.BoFu.mainMessage}"</p>` : ''}
              </div>
            </td>
          </tr>
          
          <!-- Demographics (Kto jest ich klientem) -->
          <tr>
            <td style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px;">Kto jest ich klientem - Demografia</h2>
              
              <div style="margin-top: 15px; padding: 20px; background: linear-gradient(135deg, #e0e7ff, #f3e8ff); border-left: 4px solid #667eea; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #4c1d95;">Wniosek analityczny:</h3>
                <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
                  ${data.customerProfile.demographics.analysis}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Psychographics -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px;">Profil Psychograficzny</h2>
              
              <h3 style="color: #dc2626; margin: 20px 0 10px 0;">🎯 Bóle i problemy:</h3>
              <ul style="list-style: none; margin-left: 0;">
                ${data.customerProfile.psychographics.painsAndProblems.map(pain => 
                  `<li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">• ${pain}</li>`
                ).join('')}
              </ul>
              
              <h3 style="color: #16a34a; margin: 20px 0 10px 0;">✨ Pragnienia i cele:</h3>
              <ul style="list-style: none; margin-left: 0;">
                ${data.customerProfile.psychographics.desiresAndGoals.map(desire => 
                  `<li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">• ${desire}</li>`
                ).join('')}
              </ul>
              
              <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #f0f4ff, #e8e0ff); border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: #667eea;">🚀 Oferowana transformacja:</h4>
                <p style="margin: 0; font-size: 16px; font-weight: 500;">
                  ${data.customerProfile.psychographics.offeredTransformation}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Messaging Anatomy (Anatomia przekazu reklamowego) -->
          <tr>
            <td style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px;">Anatomia Przekazu Reklamowego</h2>
              
              <!-- Communication -->
              <div style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">📢 Komunikacja</h3>
                <p><strong>Ton głosu:</strong> ${data.messagingAnatomy.communication.toneOfVoice}</p>
                
                <div style="margin: 15px 0;">
                  <strong>Dominujące emocje:</strong>
                  <div style="margin-top: 10px;">
                    ${data.messagingAnatomy.communication.dominantEmotions.map(emotion => 
                      `<span style="display: inline-block; margin: 5px; padding: 5px 12px; background: #667eea; color: white; border-radius: 20px; font-size: 14px;">${emotion}</span>`
                    ).join('')}
                  </div>
                </div>
                
                <div style="margin: 15px 0;">
                  <strong>Kąty sprzedażowe:</strong>
                  <ul style="list-style: none; margin: 10px 0 0 0; padding: 0;">
                    ${data.messagingAnatomy.communication.salesAngles.map(angle => 
                      `<li style="padding: 8px; margin: 5px 0; background: white; border-left: 3px solid #667eea;">📌 ${angle}</li>`
                    ).join('')}
                  </ul>
                </div>
                
                <p style="margin-top: 15px; padding: 15px; background: white; border-radius: 4px; font-style: italic;">
                  ${data.messagingAnatomy.communication.analysis}
                </p>
              </div>
              
              <!-- Visuals -->
              <div>
                <h3 style="color: #333; margin-bottom: 15px;">🎨 Wizualizacja</h3>
                <p><strong>Dominujący styl:</strong> ${data.messagingAnatomy.visuals.dominantStyle}</p>
                
                <div style="margin: 15px 0;">
                  <strong>Najczęstsze elementy:</strong>
                  <div style="margin-top: 10px;">
                    ${data.messagingAnatomy.visuals.commonElements.map(element => 
                      `<span style="display: inline-block; margin: 5px; padding: 5px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">🎯 ${element}</span>`
                    ).join('')}
                  </div>
                </div>
                
                <div style="margin: 15px 0;">
                  <strong>Paleta kolorów:</strong>
                  <table style="margin-top: 10px; border-collapse: collapse;">
                    <tr>
                      ${data.messagingAnatomy.visuals.colorPalette.map(color => 
                        `<td style="padding: 10px; text-align: center;">
                          <div style="width: 60px; height: 60px; background: ${color.hex}; border-radius: 8px; margin: 0 auto 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                          <small style="display: block; font-size: 11px;">${color.name}</small>
                          <small style="display: block; font-size: 10px; color: #666;">${color.hex}</small>
                        </td>`
                      ).join('')}
                    </tr>
                  </table>
                </div>
                
                <p style="margin-top: 15px; padding: 15px; background: white; border-radius: 4px; font-style: italic;">
                  ${data.messagingAnatomy.visuals.analysis}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Distribution and Formats -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px;">Dystrybucja i Formaty</h2>
              
              <h3 style="color: #333; margin-bottom: 15px;">📊 Rozkład formatów reklam:</h3>
              <table width="100%" style="border-collapse: collapse;">
                <tr style="background: #e5e7eb;">
                  <th style="padding: 10px; text-align: left; border: 1px solid #d1d5db;">Format</th>
                  <th style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">Udział %</th>
                </tr>
                ${data.distributionAndFormats.formatsChartData.map(format => `
                  <tr>
                    <td style="padding: 10px; border: 1px solid #d1d5db;">
                      <strong>${format.label}</strong>
                    </td>
                    <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">
                      <div style="position: relative; background: #e5e7eb; height: 25px; border-radius: 4px; overflow: hidden;">
                        <div style="position: absolute; left: 0; top: 0; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); width: ${format.value}%; transition: width 0.3s;"></div>
                        <span style="position: relative; z-index: 1; line-height: 25px; color: #333; font-weight: bold;">${format.value}%</span>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </table>
              
              <div style="margin-top: 20px; padding: 15px; background: #f0f4ff; border-radius: 4px;">
                <h4 style="margin: 0 0 10px 0; color: #667eea;">📱 Analiza strategii platformowej:</h4>
                <p style="margin: 0;">
                  ${data.distributionAndFormats.platformStrategyAnalysis}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Top Hooks Analysis -->
          ${(data.topHooksAnalysis?.hooks || data.adHooks || []).length > 0 ? `
          <tr>
            <td style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px;">🎣 Najskuteczniejsze Haki</h2>
              
              ${(data.topHooksAnalysis?.hooks || data.adHooks || []).map((hook, idx) => `
                <div style="margin-bottom: 20px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #667eea;">
                  <h3 style="margin: 0 0 10px 0; color: #333;">Hook #${idx + 1}</h3>
                  <p style="margin: 10px 0; font-size: 16px; font-style: italic; color: #4b5563;">
                    "${hook.hookText}"
                  </p>
                  <a href="${hook.referenceUrl}" style="color: #667eea; text-decoration: none; font-size: 14px;">
                    🔗 Zobacz przykład reklamy →
                  </a>
                </div>
              `).join('')}
            </td>
          </tr>
          ` : ''}
          
          <!-- Competitive Positioning -->
          ${(data.competitivePositioning?.opportunities || data.competitiveOpportunities || []).length > 0 ? `
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px;">🎯 Strategiczne Możliwości</h2>
              
              ${(data.competitivePositioning?.opportunities || data.competitiveOpportunities || []).map((opp, idx) => `
                <div style="margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 8px;">
                  <h3 style="margin: 0 0 10px 0; color: #92400e;">
                    ⚠️ Słabość konkurenta #${idx + 1}
                  </h3>
                  <p style="margin: 10px 0; color: #451a03;">
                    <strong>Problem:</strong> ${opp.weakness}
                  </p>
                  <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 4px;">
                    <p style="margin: 0; color: #166534;">
                      <strong>💡 Nasza rekomendacja:</strong> ${opp.recommendation}
                    </p>
                  </div>
                </div>
              `).join('')}
            </td>
          </tr>
          ` : ''}
          
          <!-- Tactical Playbook -->
          <tr>
            <td style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #667eea; margin-bottom: 20px; font-size: 24px;">🎮 Taktyki do Wypróbowania</h2>
              ${data.tacticalPlaybook.map(play => `
                <div style="margin-bottom: 15px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid ${
                  play.playName === 'adapt' ? '#10b981' : 
                  play.playName === 'exploit' ? '#3b82f6' : '#eab308'
                };">
                  <h3 style="margin: 0 0 10px 0; color: ${
                    play.playName === 'adapt' ? '#10b981' : 
                    play.playName === 'exploit' ? '#3b82f6' : '#eab308'
                  };">
                    ${play.playName === 'adapt' ? '🚀 Adaptuj' : 
                      play.playName === 'exploit' ? '💡 Wykorzystaj' : 
                      '🧪 Testuj'}
                  </h3>
                  <p style="margin: 0; line-height: 1.6;">${play.description}</p>
                </div>
              `).join('')}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background: #f0f0f0; text-align: center; color: #666;">
              <p style="margin: 0;">Wygenerowano automatycznie przez system analizy konkurencji</p>
              <p style="margin: 5px 0 0 0; font-size: 12px;">© 2024 Strategic Report Generator</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    return html;
  };

  // Function to send email
  const handleSendEmail = async (values: z.infer<typeof emailSchema>) => {
    setIsSending(true);
    
    try {
      const emailHTML = generateEmailHTML();
      
      const payload = {
        email: values.email,
        subject: `Raport Strategiczny - ${data.reportMetadata.analyzedCompanyName}`,
        htmlContent: emailHTML,
        metadata: {
          companyName: data.reportMetadata.analyzedCompanyName,
          reportDate: data.reportMetadata.analysisDate,
          timestamp: new Date().toISOString()
        }
      };
      
      const response = await fetch('https://n8n.akademia.click/webhook/83dec58d-c2d4-40ec-b704-7da4ca7c3f59', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Błąd podczas wysyłania');
      }
      
      toast.success(`Raport został wysłany na adres ${values.email}`);
      setIsEmailDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Błąd podczas wysyłania raportu:', error);
      toast.error('Wystąpił błąd podczas wysyłania raportu');
    } finally {
      setIsSending(false);
    }
  };
  const handleExportPDF = async () => {
    try {
      // Show loading toast
      toast.loading('Generowanie PDF...', { id: 'pdf-export' });
      
      // Find element to export
      const element = document.getElementById('strategic-report-content');
      if (!element) {
        toast.error('Nie można znaleźć raportu do eksportu', { id: 'pdf-export' });
        return;
      }
      
      // Configure html2canvas
      const canvas = await html2canvas(element, {
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      } as any);
      
      // Convert to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Generate filename
      const fileName = `raport-strategiczny-${data.reportMetadata.analyzedCompanyName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save PDF
      pdf.save(fileName);
      
      toast.success('PDF został wygenerowany!', { id: 'pdf-export' });
    } catch (error) {
      console.error('Błąd podczas generowania PDF:', error);
      toast.error('Wystąpił błąd podczas generowania PDF', { id: 'pdf-export' });
    }
  };
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
    labels: data.distributionAndFormats?.formatsChartData?.map(item => item.label) || [],
    datasets: [
      {
        data: data.distributionAndFormats?.formatsChartData?.map(item => item.value) || [],
        backgroundColor: [
          'hsl(220 70% 50%)',    // Bright blue
          'hsl(280 70% 50%)',    // Purple
          'hsl(160 70% 40%)',    // Teal
          'hsl(45 90% 50%)',     // Gold
          'hsl(340 70% 50%)',    // Pink
          'hsl(200 70% 40%)',    // Dark cyan
        ],
        borderWidth: 1,
        borderColor: 'hsl(var(--border))',
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


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b py-10 no-print">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-4 mb-6">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="no-print"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do dashboardu
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="default"
              size="sm"
              className="no-print"
            >
              <Download className="mr-2 h-4 w-4" />
              Pobierz PDF
            </Button>
            <Button
              onClick={() => setIsEmailDialogOpen(true)}
              variant="outline"
              size="sm"
              className="no-print"
            >
              <Mail className="mr-2 h-4 w-4" />
              Wyślij na email
            </Button>
          </div>
          
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

      <main id="strategic-report-content" className="max-w-7xl mx-auto px-6 py-16 space-y-20 bg-white">
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

        {/* Customer Journey */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            Customer Journey - Lejek Sprzedażowy
          </h2>
          
          <div className="max-w-4xl mx-auto">
            {/* ToFu - Top of Funnel */}
            <div className="relative">
              <Card className="relative overflow-hidden border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 h-14 w-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Megaphone className="h-7 w-7 text-blue-500" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-1 text-blue-600 dark:text-blue-400">
                        Top of Funnel (ToFu) - Świadomość
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">Przyciąganie uwagi i budowanie świadomości marki</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Wykorzystywane narzędzia:</p>
                          <div className="flex flex-wrap gap-2">
                            {data.customerJourney.ToFu.usedTools.length > 0 ? (
                              data.customerJourney.ToFu.usedTools.map((tool, idx) => (
                                <Badge key={idx} variant="outline" className="bg-blue-500/10 border-blue-500/30">
                                  {tool}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground italic text-sm">Brak danych</span>
                            )}
                          </div>
                        </div>
                        {data.customerJourney.ToFu.mainMessage && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Główny przekaz:</p>
                            <p className="font-medium italic">"{data.customerJourney.ToFu.mainMessage}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow down */}
              <div className="flex justify-center -mt-2 relative z-10">
                <div className="bg-gradient-to-b from-blue-500/20 to-purple-500/20 p-2 rounded-full">
                  <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* MoFu - Middle of Funnel */}
            <div className="relative -mt-2">
              <div className="mx-auto" style={{ width: '90%' }}>
                <Card className="relative overflow-hidden border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent hover:shadow-xl transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 h-14 w-14 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <UserCheck className="h-7 w-7 text-purple-500" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold mb-1 text-purple-600 dark:text-purple-400">
                          Middle of Funnel (MoFu) - Zainteresowanie
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">Edukacja i budowanie relacji z potencjalnymi klientami</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Wykorzystywane narzędzia:</p>
                            <div className="flex flex-wrap gap-2">
                              {data.customerJourney.MoFu.usedTools.length > 0 ? (
                                data.customerJourney.MoFu.usedTools.map((tool, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-purple-500/10 border-purple-500/30">
                                    {tool}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground italic text-sm">Brak danych</span>
                              )}
                            </div>
                          </div>
                          {data.customerJourney.MoFu.mainMessage && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Główny przekaz:</p>
                              <p className="font-medium italic">"{data.customerJourney.MoFu.mainMessage}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Arrow down */}
              <div className="flex justify-center -mt-2 relative z-10">
                <div className="bg-gradient-to-b from-purple-500/20 to-green-500/20 p-2 rounded-full">
                  <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* BoFu - Bottom of Funnel */}
            <div className="relative -mt-2">
              <div className="mx-auto" style={{ width: '75%' }}>
                <Card className="relative overflow-hidden border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent hover:shadow-xl transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
                        <ShoppingCart className="h-7 w-7 text-green-500" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold mb-1 text-green-600 dark:text-green-400">
                          Bottom of Funnel (BoFu) - Konwersja
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">Finalizacja sprzedaży i przekształcenie w klientów</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Wykorzystywane narzędzia:</p>
                            <div className="flex flex-wrap gap-2">
                              {data.customerJourney.BoFu.usedTools.length > 0 ? (
                                data.customerJourney.BoFu.usedTools.map((tool, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-green-500/10 border-green-500/30">
                                    {tool}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground italic text-sm">Brak danych</span>
                              )}
                            </div>
                          </div>
                          {data.customerJourney.BoFu.mainMessage && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Główny przekaz:</p>
                              <p className="font-medium italic">"{data.customerJourney.BoFu.mainMessage}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
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
                  <div className="flex flex-wrap gap-3 mt-2">
                    {data.messagingAnatomy.visuals.colorPalette.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-card/50 rounded-md px-2 py-1 border border-border"
                        title={`Hex: ${color.hex}`}
                      >
                        <div
                          className="w-6 h-6 rounded border-2 border-border shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm font-mono">
                          {color.name.startsWith('#') ? color.name : `${color.name}`}
                        </span>
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
            {(data.topHooksAnalysis?.hooks || data.adHooks || []).map((hook, idx) => (
              <Card 
                key={idx} 
                className="relative hover:shadow-xl transition-all duration-200 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -right-6 -bottom-6 opacity-5">
                  <Lightbulb className="h-24 w-24" />
                </div>
                <CardContent className="p-6 relative z-10">
                  <blockquote className="text-lg md:text-xl font-semibold italic text-foreground/90 mb-6">
                    "{hook.hookText}"
                  </blockquote>
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
        {data.distributionAndFormats && (
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
                  {data.distributionAndFormats.formatsChartData && data.distributionAndFormats.formatsChartData.length > 0 ? (
                    <>
                      <div className="h-64">
                        <Doughnut data={formatChartData} options={formatChartOptions} />
                      </div>
                      <div className="flex items-center">
                        <div>
                          <h4 className="text-lg font-bold mb-2">Analiza Strategii Platform:</h4>
                          <p className="text-muted-foreground">
                            {data.distributionAndFormats.platformStrategyAnalysis || 'Brak danych o strategii platform.'}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      Brak danych o dystrybucji i formatach
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Competitive Positioning */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            Pozycjonowanie Konkurencyjne i Twoja Szansa
          </h2>
          
          <div className="space-y-8">
            {(data.competitivePositioning?.opportunities || data.competitiveOpportunities || []).map((opportunity, idx) => (
              <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-muted">
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
              const IconComponent = getPlayIcon(play.playName);
              return (
                <Card
                  key={idx}
                  className={`transition-all hover:shadow-lg hover:-translate-y-1 border-2 ${getPlayColor(play.playName)}`}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                      <IconComponent className="h-6 w-6" />
                      Play #{idx + 1}: {play.playName.charAt(0).toUpperCase() + play.playName.slice(1)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{play.description}</p>
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

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wyślij raport na email</DialogTitle>
            <DialogDescription>
              Wprowadź adres email, na który chcesz wysłać raport strategiczny
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSendEmail)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="twoj@email.pl" 
                        type="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEmailDialogOpen(false)}
                >
                  Anuluj
                </Button>
                <Button type="submit" disabled={isSending}>
                  {isSending ? (
                    <>Wysyłanie...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Wyślij
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategicReport;