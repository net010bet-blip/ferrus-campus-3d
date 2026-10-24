// FERRO CAMPUS 2026 — data-driven campus locations; meters in a common world coordinate system.
export const ZONES = [
 ['recv','Recebimento','DOCA 01',-37,-21,'industrial','Conferência, certificados e rastreabilidade de matérias-primas'],
 ['stock','Estoque de matéria-prima','ARMAZÉM M1',-20,-21,'industrial','Armazenamento e controle FIFO'],
 ['cnc1','Usinagem CNC · Linha A','CÉLULA CNC-01',-2,-21,'industrial','Torneamento de precisão e controle estatístico'],
 ['cnc2','Usinagem CNC · Linha B','CÉLULA CNC-02',17,-21,'industrial','Fresamento e ajuste dimensional'],
 ['assembly','Montagem','POSTO MT-03',34,-21,'industrial','Torque e controle das montagens'],
 ['maintenance','Manutenção industrial','MRO 01',-37,19,'industrial','Manutenção preventiva e corretiva'],
 ['office','Escritório da Qualidade','CQ / ERP',-20,19,'industrial','Registros, planos de reação e indicadores'],
 ['metro','Metrologia','LAB DIM',-2,19,'industrial','Micrômetros, paquímetros e calibração'],
 ['final','Inspeção final','PORTÃO CQ',17,19,'industrial','Aceitação, segregação e liberação técnica'],
 ['pack','Embalagem','PACK 01',33,19,'industrial','Identificação e conferência'],
 ['ship','Expedição','DOCA 04',40,4,'industrial','Controle de carregamento e documentos'],
 ['lab','Laboratório de Materiais','LAB MAT',-20,0,'industrial','Dureza, análise e verificação do material'],
 ['reception','Recepção','ADM · RECEPÇÃO',0,77,'admin','Acesso a visitantes e comunicação'],
 ['qlead','Gerência da Qualidade','ADM · QUALIDADE',-25,89,'admin','Decisão e gestão de risco da qualidade'],
 ['hr','Gestão de Pessoas','ADM · RH',-5,89,'admin','Treinamentos, escalas e habilitação'],
 ['purchase','Suprimentos e Compras','ADM · COMPRAS',23,89,'admin','Homologação e risco de fornecedores'],
 ['finance','Controladoria e Finanças','ADM · FINANÇAS',24,107,'admin','Orçamento, investimentos e perdas'],
 ['commercial','Comercial e Clientes','ADM · CLIENTES',6,107,'admin','Prazos e reclamações de clientes'],
 ['meeting','Diretoria','ADM · DIRETORIA',-14,107,'admin','Decisões entre qualidade, custo e prazo'],
 ['it','TI e Sistemas','ADM · TI',-32,106,'admin','ERP, apontamentos e integridade de dados'],
 ['engineering','Engenharia de Processos','TEC · ENGENHARIA',-75,88,'tech','Capabilidade e revisão de processos'],
 ['training','Centro de Treinamento','TEC · TREINAMENTO',-55,88,'tech','Treinamento e padronização'],
 ['audit','Auditoria e Compliance','TEC · AUDITORIA',-73,104,'tech','Auditorias e registros de não conformidade'],
 ['hse','SSMA','TEC · SSMA',-54,104,'tech','Riscos industriais, saúde e meio ambiente'],
 ['distribution','Centro de Distribuição','CD · OPERAÇÃO',62,81,'logistic','Conferência, coleta e expedição'],
 ['logoffice','Planejamento Logístico','CD · PLANEJAMENTO',72,105,'logistic','Transportes e janelas de entrega'],
 ['restaurant','Refeitório e Convivência','SERV · REFEITÓRIO',-2,140,'service','Pausas e bem-estar'],
 ['utilities','Utilidades e ETE','SERV · UTILIDADES',-70,143,'service','Ar comprimido, energia e tratamento'],
 ['parking','Estacionamento','EXT · ESTACIONAMENTO',61,149,'outdoor','Circulação de veículos'],
 ['gate','Portaria Principal','EXT · PORTARIA',0,174,'outdoor','Controle de acesso'],
].map(([id,name,code,x,z,kind,desc])=>({id,name,code,x,z,kind,desc}));
export const BY_ID=Object.fromEntries(ZONES.map(z=>[z.id,z]));
export const MACHINE_BASE=[
{id:'CNC-A01',zone:'cnc1',kind:'Centro de torneamento',nominal:32,tolerance:.12,rate:8.6},
{id:'CNC-A02',zone:'cnc1',kind:'Centro de torneamento',nominal:32,tolerance:.12,rate:8.3},
{id:'CNC-B01',zone:'cnc2',kind:'Centro de fresamento',nominal:48,tolerance:.10,rate:7.8},
{id:'CNC-B02',zone:'cnc2',kind:'Centro de fresamento',nominal:48,tolerance:.10,rate:7.3},
{id:'MON-03',zone:'assembly',kind:'Estação de montagem',nominal:60,tolerance:.20,rate:6.3},
{id:'TEST-04',zone:'final',kind:'Inspeção final',nominal:60,tolerance:.20,rate:5.0}
];
export const INITIAL_STOCK=1750;
