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
          upload: {
            title: 'Upload Documents',
            selectFileOrUrl: 'Please select a file or enter a URL.',
            dragAndDrop: 'Drag and drop a file here',
            orClick: 'or click to select a file',
            or: 'or',
            enterUrl: 'Enter a URL',
            processing: 'Processing...',
            submit: 'Submit',
            successFile: 'File uploaded successfully! Doc ID: {{docId}}',
            successUrl: 'URL ingested successfully! Doc ID: {{docId}}',
            error: 'Error: {{message}}',
            dropzone: 'Drop your files here or click to upload',
            supported: 'Supports PDF, DOCX, TXT, XLSX, CSV, PPTX, HTML, MD (max 5MB)',
            chooseFiles: 'Choose Files',
            selectedFiles: 'Selected Files:',
            orDivider: '— OR —',
            urlPlaceholder: 'Enter URLs separated by commas...',
            tryExample: 'Nothing to hand? Try a real paper:',
            tryExampleName: 'Attention Is All You Need (PDF, 15 pages)',
            urlsToProcess: 'URLs to process:',
            submitAll: 'Submit All',
            selectFilesOrUrls: 'Please select files or enter URLs',
            results: 'Processing Results:',
            readyPrompt: 'Ready to ask questions about your documents?',
            goToQuery: 'Ask a question'
          },
          query: {
            title: 'Ask a Question',
            placeholder: 'Enter your question',
            submit: 'Submit Query',
            searching: 'Searching...',
            error: 'Error performing query: {{message}}',
            answer: 'Answer',
            sources: 'Sources',
            page: 'p.{{page}}',
          },
          documents: {
            title: 'My Documents',
            noDocuments: 'No documents uploaded yet.',
            delete: 'Delete',
            error: 'Error deleting document: {{message}}',
            noDocumentsHint: 'No documents yet. Add one above.',
            deleteTitle: 'Delete document',
            fallbackType: 'Document',
          },
          session: {
            loading: 'Loading session...',
            id: 'Session ID: {{sessionId}}',
          }
        }
      },
      es: {
        translation: {
          upload: {
            title: 'Subir Documentos',
            selectFileOrUrl: 'Por favor seleccione un archivo o ingrese una URL.',
            dragAndDrop: 'Arrastre y suelte un archivo aquí',
            orClick: 'o haga clic para seleccionar un archivo',
            or: 'o',
            enterUrl: 'Ingrese una URL',
            processing: 'Procesando...',
            submit: 'Enviar',
            successFile: '¡Archivo subido con éxito! ID del documento: {{docId}}',
            successUrl: '¡URL ingerida con éxito! ID del documento: {{docId}}',
            error: 'Error: {{message}}',
            dropzone: 'Suelte sus archivos aquí o haga clic para subir',
            supported: 'Admite PDF, DOCX, TXT, XLSX, CSV, PPTX, HTML, MD (máx. 5MB)',
            chooseFiles: 'Elegir archivos',
            selectedFiles: 'Archivos seleccionados:',
            orDivider: '— O —',
            urlPlaceholder: 'Ingrese URLs separadas por comas...',
            tryExample: 'Sin documento a mano? Pruebe un articulo real:',
            tryExampleName: 'Attention Is All You Need (PDF, 15 paginas)',
            urlsToProcess: 'URLs a procesar:',
            submitAll: 'Enviar todo',
            selectFilesOrUrls: 'Seleccione archivos o ingrese URLs',
            results: 'Resultados del procesamiento:',
            readyPrompt: '¿Listo para hacer preguntas sobre sus documentos?',
            goToQuery: 'Ir a la sección de consultas'
          },
          query: {
            title: 'Hacer una Pregunta',
            placeholder: 'Escriba su pregunta',
            submit: 'Enviar Pregunta',
            searching: 'Buscando...',
            error: 'Error al realizar la consulta: {{message}}',
            answer: 'Respuesta',
            sources: 'Fuentes',
            page: 'p.{{page}}',
          },
          documents: {
            title: 'Mis Documentos',
            noDocuments: 'Aún no se han subido documentos.',
            delete: 'Eliminar',
            error: 'Error al eliminar el documento: {{message}}',
            noDocumentsHint: 'Aún no se han subido documentos. Vaya a la pestaña Subir para añadir documentos.',
            deleteTitle: 'Eliminar documento',
            fallbackType: 'Documento',
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