import policeUTurnManagementService from './policeUTurnManagementService';

export const policeUTurnUnitService = {
  ...policeUTurnManagementService,
  getUnits: policeUTurnManagementService.getAllUTurnUnits,
  getSummary: policeUTurnManagementService.getSummary,
  exportPdf: policeUTurnManagementService.exportPdf
};

export default policeUTurnUnitService;
