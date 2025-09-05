import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          nav: {
            upload: 'Upload',
            query: 'Query',
            documents: 'Documents',
          },
          upload: {
            title: 'Upload Documents',
            fileTitle: 'Upload a file',
            urlTitle: 'Ingest from URL',
            uploadButton: 'Upload File',
            ingestButton: 'Ingest URL',
            uploading: 'Uploading...',
            ingesting: 'Ingesting...',
            selectFile: 'Please select a file.',
            enterUrl: 'Please enter a URL.',
            successFile: 'File uploaded successfully! Doc ID: {{docId}}',
            successUrl: 'URL ingested successfully! Doc ID: {{docId}}',
            errorFile: 'Error uploading file: {{message}}',
            errorUrl: 'Error ingesting URL: {{message}}',
          },
          query: {
            title: 'Ask a Question',
            placeholder: 'Enter your question',
            submit: 'Submit Query',
            searching: 'Searching...',
            error: 'Error performing query: {{message}}',
            answer: 'Answer',
            sources: 'Sources',
          },
          documents: {
            title: 'My Documents',
            noDocuments: 'No documents uploaded yet.',
            delete: 'Delete',
            error: 'Error deleting document: {{message}}',
          },
          session: {
            loading: 'Loading session...',
            id: 'Session ID: {{sessionId}}',
          }
        }
      },
      es: {
        translation: {
          nav: {
            upload: 'Subir',
            query: 'Preguntar',
            documents: 'Documentos',
          },
          upload: {
            title: 'Subir Documentos',
            fileTitle: 'Subir un archivo',
            urlTitle: 'Ingerir desde URL',
            uploadButton: 'Subir Archivo',
            ingestButton: 'Ingerir URL',
            uploading: 'Subiendo...',
            ingesting: 'Ingiriendo...',
            selectFile: 'Por favor seleccione un archivo.',
            enterUrl: 'Por favor ingrese una URL.',
            successFile: '¡Archivo subido con éxito! ID del documento: {{docId}}',
            successUrl: '¡URL ingerida con éxito! ID del documento: {{docId}}',
            errorFile: 'Error al subir el archivo: {{message}}',
            errorUrl: 'Error al ingerir la URL: {{message}}',
          },
          query: {
            title: 'Hacer una Pregunta',
            placeholder: 'Escriba su pregunta',
            submit: 'Enviar Pregunta',
            searching: 'Buscando...',
            error: 'Error al realizar la consulta: {{message}}',
            answer: 'Respuesta',
            sources: 'Fuentes',
          },
          documents: {
            title: 'Mis Documentos',
            noDocuments: 'Aún no se han subido documentos.',
            delete: 'Eliminar',
            error: 'Error al eliminar el documento: {{message}}',
          },
          session: {
            loading: 'Cargando sesión...',
            id: 'ID de sesión: {{sessionId}}',
          }
        }
      }
    }
  });

export default i18n;
