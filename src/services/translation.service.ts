
import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'en' | 'pt' | 'es' | 'fr';

const DICTIONARY = {
  en: {
    common: {
      back: 'Back to Base',
      loading: 'Processing...',
      success: 'Operation Successful',
      error: 'Error occurred',
      copy: 'Copy Buffer',
      copied: 'Copied to Clipboard',
      idle: 'Awaiting Signal...',
      processing: 'Processing',
      upload: 'Upload Binary Object',
      release: 'Release to Initialize',
      maxSize: 'Max 256MB • Drag & Drop'
    },
    landing: {
      features: 'Features',
      security: 'Security',
      enterprise: 'Enterprise',
      signin: 'Sign In',
      start: 'Get Started',
      badge: 'System Secure // v3.0',
      headline_1: 'Silence is',
      headline_2: 'Security.',
      subheadline: 'Military-grade encryption in a vacuum. No logs. No traces. Total darkness for your data.',
      cta_primary: 'INITIALIZE VAULT',
      cta_secondary: 'VIEW SPECS',
      tactical_title: 'Tactical Advantages',
      tactical_desc: 'Engineered for operations where failure is not an option.',
      card_1_title: 'AES-256 GCM',
      card_1_desc: 'Standard issue for classified data. All encryption occurs client-side. The server receives only noise.',
      card_2_title: 'Zero Sight',
      card_2_desc: 'We are blind to your data. No master keys. No backdoors.',
      card_3_title: 'Open Source',
      card_3_desc: 'Verified by the community. You don\'t have to trust us. Trust the code.',
      card_4_title: 'Swiss Neutrality',
      card_4_desc: 'Data residency in Zurich. Outside of the Fourteen Eyes intelligence alliance.'
    },
    auth: {
      title: 'Kryptos Vault',
      subtitle: 'Restricted Access // Class 4',
      identity: 'Identity',
      passphrase: 'Passphrase',
      submit: 'Authenticate',
      footer: 'ENCRYPTION: AES-256-GCM // ZURICH NODE'
    },
    dashboard: {
      nav_text: 'Text & Code',
      nav_files: 'File Vault',
      logout: 'Log Out',
      status: 'Agent Status: Active',
      header_status: 'ENCRYPTED CONNECTION ESTABLISHED'
    },
    dashboard_overview: {
      welcome: 'Welcome back, Agent.',
      system_secure: 'System Secure',
      total_enc: 'Total Encryptions',
      data_prot: 'Data Protected',
      threats: 'Threats Blocked',
      secure_badge: 'SECURE',
      activity_title: 'Encryption Activity',
      logs_title: 'Recent Logs',
      logs_live: 'LIVE',
      quick_action: 'Quick Encrypt',
      reqs: 'reqs'
    },
    text_enc: {
      source_label: 'Source Input',
      source_placeholder: 'Paste sensitive data here...',
      key_label: 'Decryption Key',
      key_placeholder: 'Enter 256-bit passphrase',
      btn_encrypt: 'Encrypt',
      btn_decrypt: 'Decrypt',
      output_label: 'Encrypted Stream'
    },
    file_enc: {
      drag_title: 'Upload Binary Object',
      drag_release: 'Release to Initialize',
      key_placeholder: 'ENCRYPTION KEY',
      btn_secure: 'Secure File'
    }
  },
  pt: {
    common: {
      back: 'Voltar à Base',
      loading: 'Processando...',
      success: 'Operação com Sucesso',
      error: 'Ocorreu um erro',
      copy: 'Copiar Buffer',
      copied: 'Copiado',
      idle: 'Aguardando Sinal...',
      processing: 'Processando',
      upload: 'Upload de Objeto Binário',
      release: 'Solte para Inicializar',
      maxSize: 'Max 256MB • Arraste e Solte'
    },
    landing: {
      features: 'Recursos',
      security: 'Segurança',
      enterprise: 'Empresarial',
      signin: 'Entrar',
      start: 'Começar',
      badge: 'Sistema Seguro // v3.0',
      headline_1: 'Silêncio é',
      headline_2: 'Segurança.',
      subheadline: 'Criptografia militar no vácuo. Sem logs. Sem rastros. Escuridão total para seus dados.',
      cta_primary: 'INICIALIZAR COFRE',
      cta_secondary: 'VER ESPECIFICAÇÕES',
      tactical_title: 'Vantagens Táticas',
      tactical_desc: 'Projetado para operações onde a falha não é uma opção.',
      card_1_title: 'AES-256 GCM',
      card_1_desc: 'Padrão para dados confidenciais. Toda criptografia ocorre no cliente. O servidor recebe apenas ruído.',
      card_2_title: 'Zero Visibilidade',
      card_2_desc: 'Somos cegos aos seus dados. Sem chaves mestras. Sem backdoors.',
      card_3_title: 'Código Aberto',
      card_3_desc: 'Verificado pela comunidade. Você não precisa confiar em nós. Confie no código.',
      card_4_title: 'Neutralidade Suíça',
      card_4_desc: 'Residência de dados em Zurique. Fora da aliança de inteligência Fourteen Eyes.'
    },
    auth: {
      title: 'Cofre Kryptos',
      subtitle: 'Acesso Restrito // Classe 4',
      identity: 'Identidade',
      passphrase: 'Senha de Acesso',
      submit: 'Autenticar',
      footer: 'CRIPTOGRAFIA: AES-256-GCM // NÓ DE ZURIQUE'
    },
    dashboard: {
      nav_text: 'Texto & Código',
      nav_files: 'Cofre de Arquivos',
      logout: 'Sair',
      status: 'Status do Agente: Ativo',
      header_status: 'CONEXÃO CRIPTOGRAFADA ESTABELECIDA'
    },
    dashboard_overview: {
      welcome: 'Bem-vindo, Agente.',
      system_secure: 'Sistema Seguro',
      total_enc: 'Criptografias Totais',
      data_prot: 'Dados Protegidos',
      threats: 'Ameaças Bloqueadas',
      secure_badge: 'SEGURO',
      activity_title: 'Atividade Recente',
      logs_title: 'Logs do Sistema',
      logs_live: 'AO VIVO',
      quick_action: 'Criptografia Rápida',
      reqs: 'reqs'
    },
    text_enc: {
      source_label: 'Entrada de Fonte',
      source_placeholder: 'Cole dados sensíveis aqui...',
      key_label: 'Chave de Descriptografia',
      key_placeholder: 'Insira a frase secreta de 256 bits',
      btn_encrypt: 'Criptografar',
      btn_decrypt: 'Descriptografar',
      output_label: 'Fluxo Criptografado'
    },
    file_enc: {
      drag_title: 'Carregar Binário',
      drag_release: 'Solte para Processar',
      key_placeholder: 'CHAVE DE CRIPTOGRAFIA',
      btn_secure: 'Proteger Arquivo'
    }
  },
  es: {
    common: {
      back: 'Volver a la Base',
      loading: 'Procesando...',
      success: 'Operación Exitosa',
      error: 'Ocurrió un error',
      copy: 'Copiar Buffer',
      copied: 'Copiado',
      idle: 'Esperando Señal...',
      processing: 'Procesando',
      upload: 'Subir Objeto Binario',
      release: 'Soltar para Inicializar',
      maxSize: 'Máx 256MB • Arrastrar y Soltar'
    },
    landing: {
      features: 'Características',
      security: 'Seguridad',
      enterprise: 'Empresas',
      signin: 'Acceder',
      start: 'Comenzar',
      badge: 'Sistema Seguro // v3.0',
      headline_1: 'Silencio es',
      headline_2: 'Seguridad.',
      subheadline: 'Cifrado de grado militar en el vacío. Sin registros. Sin rastros. Oscuridad total para tus datos.',
      cta_primary: 'INICIALIZAR BÓVEDA',
      cta_secondary: 'VER ESPECIFICACIONES',
      tactical_title: 'Ventajas Tácticas',
      tactical_desc: 'Diseñado para operaciones donde el fallo no es una opción.',
      card_1_title: 'AES-256 GCM',
      card_1_desc: 'Estándar para datos clasificados. Todo el cifrado ocurre en el cliente.',
      card_2_title: 'Cero Visibilidad',
      card_2_desc: 'Somos ciegos a tus datos. Sin llaves maestras. Sin puertas traseras.',
      card_3_title: 'Código Abierto',
      card_3_desc: 'Verificado por la comunidad. No tienes que confiar en nosotros. Confía en el código.',
      card_4_title: 'Neutralidad Suiza',
      card_4_desc: 'Residencia de datos en Zúrich. Fuera de la alianza de inteligencia.'
    },
    auth: {
      title: 'Bóveda Kryptos',
      subtitle: 'Acceso Restringido // Clase 4',
      identity: 'Identidad',
      passphrase: 'Frase de Contraseña',
      submit: 'Autenticar',
      footer: 'CIFRADO: AES-256-GCM // NODO ZÚRICH'
    },
    dashboard: {
      nav_text: 'Texto y Código',
      nav_files: 'Bóveda de Archivos',
      logout: 'Cerrar Sesión',
      status: 'Estado Agente: Activo',
      header_status: 'CONEXIÓN CIFRADA ESTABLECIDA'
    },
    dashboard_overview: {
      welcome: 'Bienvenido, Agente.',
      system_secure: 'Sistema Seguro',
      total_enc: 'Cifrados Totales',
      data_prot: 'Datos Protegidos',
      threats: 'Amenazas Bloqueadas',
      secure_badge: 'SEGURO',
      activity_title: 'Actividad de Cifrado',
      logs_title: 'Registros Recientes',
      logs_live: 'EN VIVO',
      quick_action: 'Cifrado Rápido',
      reqs: 'reqs'
    },
    text_enc: {
      source_label: 'Entrada de Fuente',
      source_placeholder: 'Pegue datos sensibles aquí...',
      key_label: 'Clave de Descifrado',
      key_placeholder: 'Ingrese frase secreta de 256 bits',
      btn_encrypt: 'Cifrar',
      btn_decrypt: 'Descifrar',
      output_label: 'Flujo Cifrado'
    },
    file_enc: {
      drag_title: 'Cargar Binario',
      drag_release: 'Soltar para Procesar',
      key_placeholder: 'CLAVE DE CIFRADO',
      btn_secure: 'Proteger Archivo'
    }
  },
  fr: {
    common: {
      back: 'Retour à la Base',
      loading: 'Traitement...',
      success: 'Opération Réussie',
      error: 'Erreur survenue',
      copy: 'Copier le Tampon',
      copied: 'Copié',
      idle: 'En attente du signal...',
      processing: 'Traitement',
      upload: 'Télécharger Objet Binaire',
      release: 'Relâcher pour Initialiser',
      maxSize: 'Max 256MB • Glisser-Déposer'
    },
    landing: {
      features: 'Fonctionnalités',
      security: 'Sécurité',
      enterprise: 'Entreprise',
      signin: 'Connexion',
      start: 'Commencer',
      badge: 'Système Sécurisé // v3.0',
      headline_1: 'Le Silence est',
      headline_2: 'Sécurité.',
      subheadline: 'Chiffrement militaire dans le vide. Pas de journaux. Pas de traces. Obscurité totale pour vos données.',
      cta_primary: 'INITIALISER COFFRE',
      cta_secondary: 'VOIR SPÉCIFICATIONS',
      tactical_title: 'Avantages Tactiques',
      tactical_desc: 'Conçu pour des opérations où l\'échec n\'est pas une option.',
      card_1_title: 'AES-256 GCM',
      card_1_desc: 'Standard pour les données classifiées. Tout le chiffrement se fait côté client.',
      card_2_title: 'Zéro Visibilité',
      card_2_desc: 'Nous sommes aveugles à vos données. Pas de clés maîtresses. Pas de portes dérobées.',
      card_3_title: 'Open Source',
      card_3_desc: 'Vérifié par la communauté. Ne nous faites pas confiance. Faites confiance au code.',
      card_4_title: 'Neutralité Suisse',
      card_4_desc: 'Résidence des données à Zurich. En dehors de l\'alliance du renseignement.'
    },
    auth: {
      title: 'Coffre Kryptos',
      subtitle: 'Accès Restreint // Classe 4',
      identity: 'Identité',
      passphrase: 'Phrase Secrète',
      submit: 'Authentifier',
      footer: 'CHIFFREMENT: AES-256-GCM // NOEUD ZURICH'
    },
    dashboard: {
      nav_text: 'Texte & Code',
      nav_files: 'Coffre de Fichiers',
      logout: 'Déconnexion',
      status: 'Statut Agent: Actif',
      header_status: 'CONNEXION CHIFFRÉE ÉTABLIE'
    },
    dashboard_overview: {
      welcome: 'Bon retour, Agent.',
      system_secure: 'Système Sécurisé',
      total_enc: 'Chiffrements Totaux',
      data_prot: 'Données Protégées',
      threats: 'Menaces Bloquées',
      secure_badge: 'SÉCURISÉ',
      activity_title: 'Activité de Chiffrement',
      logs_title: 'Journaux Récents',
      logs_live: 'EN DIRECT',
      quick_action: 'Chiffrement Rapide',
      reqs: 'reqs'
    },
    text_enc: {
      source_label: 'Entrée Source',
      source_placeholder: 'Collez les données sensibles ici...',
      key_label: 'Clé de Déchiffrement',
      key_placeholder: 'Entrez la phrase secrète de 256 bits',
      btn_encrypt: 'Chiffrer',
      btn_decrypt: 'Déchiffrer',
      output_label: 'Flux Chiffré'
    },
    file_enc: {
      drag_title: 'Charger Binaire',
      drag_release: 'Relâcher pour Traiter',
      key_placeholder: 'CLÉ DE CHIFFREMENT',
      btn_secure: 'Sécuriser Fichier'
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSignal = signal<Lang>('en');

  // Public readonly signal for consumption
  activeLang = this.currentLangSignal.asReadonly();

  // Computed signal that returns the dictionary for the current language
  t = computed(() => DICTIONARY[this.currentLangSignal()]);

  constructor() {
    // Check LocalStorage on initialization
    const savedLang = localStorage.getItem('kryptos_lang') as Lang;
    if (savedLang && ['en', 'pt', 'es', 'fr'].includes(savedLang)) {
      this.currentLangSignal.set(savedLang);
      document.documentElement.lang = savedLang;
    }
  }

  setLang(lang: Lang) {
    this.currentLangSignal.set(lang);
    document.documentElement.lang = lang;
    
    // Save to LocalStorage
    localStorage.setItem('kryptos_lang', lang);
  }
}
