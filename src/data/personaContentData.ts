/**
 * Consolidated Persona Content Data
 * 
 * This file imports all persona content JSON files and exports them as a single object.
 * Used by server-side API to avoid runtime file system reads in serverless environments.
 * 
 * Location: /data/personaContentData.ts
 */

// Import Luminary personas (External Experts)
import alexBogusky from './persona-content/alex-bogusky.json';
import billBernbach from './persona-content/bill-bernbach.json';
import byronSharp from './persona-content/byron-sharp.json';
import claudeHopkins from './persona-content/claude-hopkins.json';
import cocoChanel from './persona-content/coco-chanel.json';
import danWieden from './persona-content/dan-wieden.json';
import daveTrott from './persona-content/dave-trott.json';
import davidOgilvy from './persona-content/david-ogilvy.json';
import donDraper from './persona-content/don-draper.json';
import draytonBird from './persona-content/drayton-bird.json';
import esteeLauder from './persona-content/estee-lauder.json';
import eugeneSchwartz from './persona-content/eugene-schwartz.json';
import georgeLois from './persona-content/george-lois.json';
import gregHahn from './persona-content/greg-hahn.json';
import howardGossage from './persona-content/howard-gossage.json';
import jeffGoodby from './persona-content/jeff-goodby.json';
import johnHegarty from './persona-content/john-hegarty.json';
import josephSugarman from './persona-content/joseph-sugarman.json';
import leeClow from './persona-content/lee-clow.json';
import leoBurnett from './persona-content/leo-burnett.json';
import luminariesTechCTO from './persona-content/luminaries-tech-cto.json';
import margaretJohnson from './persona-content/margaret-johnson.json';
import maryKayAsh from './persona-content/mary-kay-ash.json';
import maryWellsLawrence from './persona-content/mary-wells-lawrence.json';
import oprahWinfrey from './persona-content/oprah-winfrey.json';
import paulaScher from './persona-content/paula-scher.json';
import richSilverstein from './persona-content/rich-silverstein.json';
import rorySutherland from './persona-content/rory-sutherland.json';
import rosserReeves from './persona-content/rosser-reeves.json';
import russellColley from './persona-content/russell-colley.json';
import sethGodin from './persona-content/seth-godin.json';
import steveJobs from './persona-content/steve-jobs.json';
import tiffanyRolfe from './persona-content/tiffany-rolfe.json';
import willyWonka from './persona-content/willy-wonka.json';

// Import Panelist personas
import panelistMillennialParent from './persona-content/panelist-millennial-parent.json';

// Import Consumer personas
import consumersB2BDepartment from './persona-content/consumers-b2b-department.json';
import consumersB2BProcurement from './persona-content/consumers-b2b-procurement.json';
import consumersB2BSMB from './persona-content/consumers-b2b-smb.json';
import consumersB2CImpulse from './persona-content/consumers-b2c-impulse.json';
import consumersB2CLoyal from './persona-content/consumers-b2c-loyal.json';
import consumersB2CResearch from './persona-content/consumers-b2c-research.json';
import consumersHeavyBuyer from './persona-content/consumers-heavy-buyer.json';
import consumersMediumBuyer from './persona-content/consumers-medium-buyer.json';
import consumersLightBuyer from './persona-content/consumers-light-buyer.json';
import consumersLoyal from './persona-content/consumers-loyal.json';
import consumersTrier from './persona-content/consumers-trier.json';
import consumersNonBuyer from './persona-content/consumers-non-buyer.json';
import consumersHeavyAlcohol from './persona-content/consumers-heavy-alcohol.json';
import consumersLightAlcohol from './persona-content/consumers-light-alcohol.json';
import consumersRTD from './persona-content/consumers-rtd.json';
import consumersPremium from './persona-content/consumers-premium.json';
import consumersSocial from './persona-content/consumers-social.json';
import consumersHealthConscious from './persona-content/consumers-health-conscious.json';

// Import Colleague personas
import colleaguesBrandManager from './persona-content/colleagues-brand-manager.json';
import colleaguesCEO from './persona-content/colleagues-ceo.json';
import colleaguesCFO from './persona-content/colleagues-cfo.json';
import colleaguesCMO from './persona-content/colleagues-cmo.json';
import colleaguesCSManager from './persona-content/colleagues-cs-manager.json';
import colleaguesCTO from './persona-content/colleagues-cto.json';
import colleaguesDirectorOps from './persona-content/colleagues-director-ops.json';
import colleaguesDirectorProduct from './persona-content/colleagues-director-product.json';
import colleaguesDirectorSales from './persona-content/colleagues-director-sales.json';
import colleaguesEngineerArchitect from './persona-content/colleagues-engineer-architect.json';
import colleaguesEngineerLead from './persona-content/colleagues-engineer-lead.json';
import colleaguesMarketingManager from './persona-content/colleagues-marketing-manager.json';
import colleaguesProductManager from './persona-content/colleagues-product-manager.json';
import colleaguesProductOwner from './persona-content/colleagues-product-owner.json';
import colleaguesSalesManager from './persona-content/colleagues-sales-manager.json';
import colleaguesSalesRep from './persona-content/colleagues-sales-rep.json';
import colleaguesSupportLead from './persona-content/colleagues-support-lead.json';

// Import Cultural Voice personas
import culturalEcoAdvocate from './persona-content/cultural-eco-advocate.json';
import culturalGamer from './persona-content/cultural-gamer.json';
import culturalGenZActivist from './persona-content/cultural-genz-activist.json';
import culturalGenZCreator from './persona-content/cultural-genz-creator.json';
import culturalGenZEntrepreneur from './persona-content/cultural-genz-entrepreneur.json';
import culturalMillennialInfluencer from './persona-content/cultural-millennial-influencer.json';
import culturalMillennialProfessional from './persona-content/cultural-millennial-professional.json';
import culturalMindfulness from './persona-content/cultural-mindfulness.json';
import culturalRuralCommunity from './persona-content/cultural-rural-community.json';
import culturalSuburbanFamily from './persona-content/cultural-suburban-family.json';
import culturalTechInnovator from './persona-content/cultural-tech-innovator.json';
import culturalUrbanArtist from './persona-content/cultural-urban-artist.json';
import culturalUrbanTrendsetter from './persona-content/cultural-urban-trendsetter.json';
import culturalWellnessGuru from './persona-content/cultural-wellness-guru.json';
import culturalZeroWaste from './persona-content/cultural-zero-waste.json';

// Import Grade/Segment personas - Demographics
import gradeDemoBoomer from './persona-content/grade-demo-boomer.json';
import gradeDemoCouple from './persona-content/grade-demo-couple.json';
import gradeDemoFamilyTeen from './persona-content/grade-demo-family-teen.json';
import gradeDemoFamilyYoung from './persona-content/grade-demo-family-young.json';
import gradeDemoGenX from './persona-content/grade-demo-gen-x.json';
import gradeDemoGenZ from './persona-content/grade-demo-gen-z.json';
import gradeDemoHighIncome from './persona-content/grade-demo-high-income.json';
import gradeDemoLowIncome from './persona-content/grade-demo-low-income.json';
import gradeDemoMiddleIncome from './persona-content/grade-demo-middle-income.json';
import gradeDemoMillennial from './persona-content/grade-demo-millennial.json';
import gradeDemoMultiGen from './persona-content/grade-demo-multi-gen.json';
import gradeDemoRural from './persona-content/grade-demo-rural.json';
import gradeDemoSingle from './persona-content/grade-demo-single.json';
import gradeDemoSuburban from './persona-content/grade-demo-suburban.json';
import gradeDemoUpperMiddle from './persona-content/grade-demo-upper-middle.json';
import gradeDemoUrban from './persona-content/grade-demo-urban.json';

// Import Grade/Segment personas - Lifestyle
import gradeLifestyleActive from './persona-content/grade-lifestyle-active.json';
import gradeLifestyleCreative from './persona-content/grade-lifestyle-creative.json';
import gradeLifestyleEco from './persona-content/grade-lifestyle-eco.json';
import gradeLifestyleEmptyNester from './persona-content/grade-lifestyle-empty-nester.json';
import gradeLifestyleFamily from './persona-content/grade-lifestyle-family.json';
import gradeLifestyleLuxury from './persona-content/grade-lifestyle-luxury.json';
import gradeLifestyleOutdoors from './persona-content/grade-lifestyle-outdoors.json';
import gradeLifestyleRetiree from './persona-content/grade-lifestyle-retiree.json';
import gradeLifestyleStudent from './persona-content/grade-lifestyle-student.json';
import gradeLifestyleTech from './persona-content/grade-lifestyle-tech.json';
import gradeLifestyleValue from './persona-content/grade-lifestyle-value.json';
import gradeLifestyleYoungProfessional from './persona-content/grade-lifestyle-young-professional.json';

// Import Grade/Segment personas - Psychographic
import gradePsychoCautious from './persona-content/grade-psycho-cautious.json';
import gradePsychoConvenience from './persona-content/grade-psycho-convenience.json';
import gradePsychoHealthConscious from './persona-content/grade-psycho-health-conscious.json';
import gradePsychoIndependent from './persona-content/grade-psycho-independent.json';
import gradePsychoInnovator from './persona-content/grade-psycho-innovator.json';
import gradePsychoPragmatic from './persona-content/grade-psycho-pragmatic.json';
import gradePsychoPrice from './persona-content/grade-psycho-price.json';
import gradePsychoProgressive from './persona-content/grade-psycho-progressive.json';
import gradePsychoQuality from './persona-content/grade-psycho-quality.json';
import gradePsychoSocial from './persona-content/grade-psycho-social.json';
import gradePsychoSpiritual from './persona-content/grade-psycho-spiritual.json';
import gradePsychoStatusSeeking from './persona-content/grade-psycho-status-seeking.json';
import gradePsychoTraditional from './persona-content/grade-psycho-traditional.json';

export interface PersonaContent {
  id: string;
  name: string;
  description: string;
  context: string;
  detailedProfile?: string;
  demographics?: {
    ageRange?: string;
    income?: string;
    shoppingChannels?: string[];
    [key: string]: any;
  };
  psychographics?: {
    values?: string[];
    triggers?: string[];
    concerns?: string[];
    motivations?: string[];
    decisionMakingStyle?: string;
    [key: string]: any;
  };
  suggestedPrompts?: string[];
  exampleQuotes?: string[];
  keyInsights?: string[];
  typicalPurchaseBehavior?: {
    purchaseTimeline?: string;
    researchProcess?: string;
    abandonmentReasons?: string[];
    conversionDrivers?: string[];
    returnsLikelihood?: string;
    [key: string]: any;
  };
  metadata?: {
    lastUpdated?: string;
    author?: string;
    version?: string;
    sources?: string[];
    reviewCycle?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Export all persona content as a map
export const personaContentMap: Record<string, PersonaContent> = {
  // Luminaries (External Experts)
  'alex-bogusky': alexBogusky as unknown as PersonaContent,
  'bill-bernbach': billBernbach as unknown as PersonaContent,
  'byron-sharp': byronSharp as unknown as PersonaContent,
  'claude-hopkins': claudeHopkins as unknown as PersonaContent,
  'coco-chanel': cocoChanel as unknown as PersonaContent,
  'dan-wieden': danWieden as unknown as PersonaContent,
  'dave-trott': daveTrott as unknown as PersonaContent,
  'david-ogilvy': davidOgilvy as unknown as PersonaContent,
  'don-draper': donDraper as unknown as PersonaContent,
  'drayton-bird': draytonBird as unknown as PersonaContent,
  'estee-lauder': esteeLauder as unknown as PersonaContent,
  'eugene-schwartz': eugeneSchwartz as unknown as PersonaContent,
  'george-lois': georgeLois as unknown as PersonaContent,
  'greg-hahn': gregHahn as unknown as PersonaContent,
  'howard-gossage': howardGossage as unknown as PersonaContent,
  'jeff-goodby': jeffGoodby as unknown as PersonaContent,
  'john-hegarty': johnHegarty as unknown as PersonaContent,
  'joseph-sugarman': josephSugarman as unknown as PersonaContent,
  'lee-clow': leeClow as unknown as PersonaContent,
  'leo-burnett': leoBurnett as unknown as PersonaContent,
  'luminaries-tech-cto': luminariesTechCTO as unknown as PersonaContent,
  'margaret-johnson': margaretJohnson as unknown as PersonaContent,
  'mary-kay-ash': maryKayAsh as unknown as PersonaContent,
  'mary-wells-lawrence': maryWellsLawrence as unknown as PersonaContent,
  'oprah-winfrey': oprahWinfrey as unknown as PersonaContent,
  'paula-scher': paulaScher as unknown as PersonaContent,
  'rich-silverstein': richSilverstein as unknown as PersonaContent,
  'rory-sutherland': rorySutherland as unknown as PersonaContent,
  'rosser-reeves': rosserReeves as unknown as PersonaContent,
  'russell-colley': russellColley as unknown as PersonaContent,
  'seth-godin': sethGodin as unknown as PersonaContent,
  'steve-jobs': steveJobs as unknown as PersonaContent,
  'tiffany-rolfe': tiffanyRolfe as unknown as PersonaContent,
  'willy-wonka': willyWonka as unknown as PersonaContent,
  
  // Panelists
  'panelist-millennial-parent': panelistMillennialParent as unknown as PersonaContent,
  
  // Consumers
  'consumers-b2b-department': consumersB2BDepartment as unknown as PersonaContent,
  'consumers-b2b-procurement': consumersB2BProcurement as unknown as PersonaContent,
  'consumers-b2b-smb': consumersB2BSMB as unknown as PersonaContent,
  'consumers-b2c-impulse': consumersB2CImpulse as unknown as PersonaContent,
  'consumers-b2c-loyal': consumersB2CLoyal as unknown as PersonaContent,
  'consumers-b2c-research': consumersB2CResearch as unknown as PersonaContent,
  'consumers-heavy-buyer': consumersHeavyBuyer as unknown as PersonaContent,
  'consumers-medium-buyer': consumersMediumBuyer as unknown as PersonaContent,
  'consumers-light-buyer': consumersLightBuyer as unknown as PersonaContent,
  'consumers-loyal': consumersLoyal as unknown as PersonaContent,
  'consumers-trier': consumersTrier as unknown as PersonaContent,
  'consumers-non-buyer': consumersNonBuyer as unknown as PersonaContent,
  'consumers-heavy-alcohol': consumersHeavyAlcohol as unknown as PersonaContent,
  'consumers-light-alcohol': consumersLightAlcohol as unknown as PersonaContent,
  'consumers-rtd': consumersRTD as unknown as PersonaContent,
  'consumers-premium': consumersPremium as unknown as PersonaContent,
  'consumers-social': consumersSocial as unknown as PersonaContent,
  'consumers-health-conscious': consumersHealthConscious as unknown as PersonaContent,
  
  // Colleagues
  'colleagues-brand-manager': colleaguesBrandManager as unknown as PersonaContent,
  'colleagues-ceo': colleaguesCEO as unknown as PersonaContent,
  'colleagues-cfo': colleaguesCFO as unknown as PersonaContent,
  'colleagues-cmo': colleaguesCMO as unknown as PersonaContent,
  'colleagues-cs-manager': colleaguesCSManager as unknown as PersonaContent,
  'colleagues-cto': colleaguesCTO as unknown as PersonaContent,
  'colleagues-director-ops': colleaguesDirectorOps as unknown as PersonaContent,
  'colleagues-director-product': colleaguesDirectorProduct as unknown as PersonaContent,
  'colleagues-director-sales': colleaguesDirectorSales as unknown as PersonaContent,
  'colleagues-engineer-architect': colleaguesEngineerArchitect as unknown as PersonaContent,
  'colleagues-engineer-lead': colleaguesEngineerLead as unknown as PersonaContent,
  'colleagues-marketing-manager': colleaguesMarketingManager as unknown as PersonaContent,
  'colleagues-product-manager': colleaguesProductManager as unknown as PersonaContent,
  'colleagues-product-owner': colleaguesProductOwner as unknown as PersonaContent,
  'colleagues-sales-manager': colleaguesSalesManager as unknown as PersonaContent,
  'colleagues-sales-rep': colleaguesSalesRep as unknown as PersonaContent,
  'colleagues-support-lead': colleaguesSupportLead as unknown as PersonaContent,
  
  // Cultural Voices
  'cultural-eco-advocate': culturalEcoAdvocate as unknown as PersonaContent,
  'cultural-gamer': culturalGamer as unknown as PersonaContent,
  'cultural-genz-activist': culturalGenZActivist as unknown as PersonaContent,
  'cultural-genz-creator': culturalGenZCreator as unknown as PersonaContent,
  'cultural-genz-entrepreneur': culturalGenZEntrepreneur as unknown as PersonaContent,
  'cultural-millennial-influencer': culturalMillennialInfluencer as unknown as PersonaContent,
  'cultural-millennial-professional': culturalMillennialProfessional as unknown as PersonaContent,
  'cultural-mindfulness': culturalMindfulness as unknown as PersonaContent,
  'cultural-rural-community': culturalRuralCommunity as unknown as PersonaContent,
  'cultural-suburban-family': culturalSuburbanFamily as unknown as PersonaContent,
  'cultural-tech-innovator': culturalTechInnovator as unknown as PersonaContent,
  'cultural-urban-artist': culturalUrbanArtist as unknown as PersonaContent,
  'cultural-urban-trendsetter': culturalUrbanTrendsetter as unknown as PersonaContent,
  'cultural-wellness-guru': culturalWellnessGuru as unknown as PersonaContent,
  'cultural-zero-waste': culturalZeroWaste as unknown as PersonaContent,
  
  // Grade - Demographics
  'grade-demo-boomer': gradeDemoBoomer as unknown as PersonaContent,
  'grade-demo-couple': gradeDemoCouple as unknown as PersonaContent,
  'grade-demo-family-teen': gradeDemoFamilyTeen as unknown as PersonaContent,
  'grade-demo-family-young': gradeDemoFamilyYoung as unknown as PersonaContent,
  'grade-demo-gen-x': gradeDemoGenX as unknown as PersonaContent,
  'grade-demo-gen-z': gradeDemoGenZ as unknown as PersonaContent,
  'grade-demo-high-income': gradeDemoHighIncome as unknown as PersonaContent,
  'grade-demo-low-income': gradeDemoLowIncome as unknown as PersonaContent,
  'grade-demo-middle-income': gradeDemoMiddleIncome as unknown as PersonaContent,
  'grade-demo-millennial': gradeDemoMillennial as unknown as PersonaContent,
  'grade-demo-multi-gen': gradeDemoMultiGen as unknown as PersonaContent,
  'grade-demo-rural': gradeDemoRural as unknown as PersonaContent,
  'grade-demo-single': gradeDemoSingle as unknown as PersonaContent,
  'grade-demo-suburban': gradeDemoSuburban as unknown as PersonaContent,
  'grade-demo-upper-middle': gradeDemoUpperMiddle as unknown as PersonaContent,
  'grade-demo-urban': gradeDemoUrban as unknown as PersonaContent,
  
  // Grade - Lifestyle
  'grade-lifestyle-active': gradeLifestyleActive as unknown as PersonaContent,
  'grade-lifestyle-creative': gradeLifestyleCreative as unknown as PersonaContent,
  'grade-lifestyle-eco': gradeLifestyleEco as unknown as PersonaContent,
  'grade-lifestyle-empty-nester': gradeLifestyleEmptyNester as unknown as PersonaContent,
  'grade-lifestyle-family': gradeLifestyleFamily as unknown as PersonaContent,
  'grade-lifestyle-luxury': gradeLifestyleLuxury as unknown as PersonaContent,
  'grade-lifestyle-outdoors': gradeLifestyleOutdoors as unknown as PersonaContent,
  'grade-lifestyle-retiree': gradeLifestyleRetiree as unknown as PersonaContent,
  'grade-lifestyle-student': gradeLifestyleStudent as unknown as PersonaContent,
  'grade-lifestyle-tech': gradeLifestyleTech as unknown as PersonaContent,
  'grade-lifestyle-value': gradeLifestyleValue as unknown as PersonaContent,
  'grade-lifestyle-young-professional': gradeLifestyleYoungProfessional as unknown as PersonaContent,
  
  // Grade - Psychographic
  'grade-psycho-cautious': gradePsychoCautious as unknown as PersonaContent,
  'grade-psycho-convenience': gradePsychoConvenience as unknown as PersonaContent,
  'grade-psycho-health-conscious': gradePsychoHealthConscious as unknown as PersonaContent,
  'grade-psycho-independent': gradePsychoIndependent as unknown as PersonaContent,
  'grade-psycho-innovator': gradePsychoInnovator as unknown as PersonaContent,
  'grade-psycho-pragmatic': gradePsychoPragmatic as unknown as PersonaContent,
  'grade-psycho-price': gradePsychoPrice as unknown as PersonaContent,
  'grade-psycho-progressive': gradePsychoProgressive as unknown as PersonaContent,
  'grade-psycho-quality': gradePsychoQuality as unknown as PersonaContent,
  'grade-psycho-social': gradePsychoSocial as unknown as PersonaContent,
  'grade-psycho-spiritual': gradePsychoSpiritual as unknown as PersonaContent,
  'grade-psycho-status-seeking': gradePsychoStatusSeeking as unknown as PersonaContent,
  'grade-psycho-traditional': gradePsychoTraditional as unknown as PersonaContent,
};

/**
 * Get persona content by ID
 * Returns fallback object if persona not found
 */
export function getPersonaContent(personaId: string): PersonaContent {
  const content = personaContentMap[personaId];
  if (content) {
    return content;
  }
  
  // Fallback for personas not in the map
  console.warn(`[PersonaContentData] Persona content not found for: ${personaId}`);
  return {
    id: personaId,
    name: personaId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'No description available',
    context: 'Standard persona context',
  };
}

/**
 * Get all available persona IDs
 */
export function getAllPersonaIds(): string[] {
  return Object.keys(personaContentMap);
}

/**
 * Check if persona content exists
 */
export function hasPersonaContent(personaId: string): boolean {
  return personaId in personaContentMap;
}