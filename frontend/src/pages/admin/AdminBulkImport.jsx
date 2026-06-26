import { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, Users, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { bulkImportService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const AdminBulkImport = () => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  
  const fileInputRef = useRef(null);

  // Simple vanilla JS CSV parser
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const expectedHeaders = ['first_name', 'last_name', 'email', 'role'];
    
    // Check if headers match mostly
    const missingHeaders = expectedHeaders.filter(eh => !headers.includes(eh));
    if (missingHeaders.length > 0) {
      alert(`Invalid CSV format. Missing columns: ${missingHeaders.join(', ')}`);
      return [];
    }

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      if (row.email) {
        data.push(row);
      }
    }
    return data;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      alert("Please upload a valid CSV file.");
      return;
    }

    setFile(selectedFile);
    setIsParsing(true);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const data = parseCSV(text);
      setParsedData(data);
      setIsParsing(false);
    };
    reader.onerror = () => {
      alert("Failed to read file.");
      setIsParsing(false);
    };
    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) return;
    setIsUploading(true);
    try {
      const res = await bulkImportService.importUsers(parsedData);
      setImportResult({
        success: true,
        message: res.data.message,
        count: res.data.success_count,
        errors: res.data.errors || []
      });
      // Reset form on success
      setFile(null);
      setParsedData([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error("Upload failed", error);
      setImportResult({
        success: false,
        message: "Server error during import.",
        count: 0,
        errors: ["Check network or contact support."]
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8 text-[var(--primary)]" />
          Bulk User Import
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Mass-create student and instructor accounts from a CSV file.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-lg">Upload CSV</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  file ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
              >
                <input 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                
                {isParsing ? (
                  <Loader2 className="h-10 w-10 text-[var(--primary)] animate-spin mx-auto mb-4" />
                ) : file ? (
                  <FileSpreadsheet className="h-10 w-10 text-[var(--primary)] mx-auto mb-4" />
                ) : (
                  <UploadCloud className="h-10 w-10 text-slate-500 mx-auto mb-4" />
                )}
                
                <h3 className="text-white font-semibold mb-1">
                  {file ? file.name : "Click to select a file"}
                </h3>
                <p className="text-slate-400 text-sm">
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : "Only .csv files allowed"}
                </p>
              </div>

              {parsedData.length > 0 && (
                <button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full mt-6 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
                  {isUploading ? "Importing Users..." : `Import ${parsedData.length} Users`}
                </button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-lg text-slate-300">CSV Format Guide</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm text-slate-400 space-y-4">
              <p>Your CSV file must include exactly these header columns in the first row:</p>
              <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-slate-300">
                <li>first_name</li>
                <li>last_name</li>
                <li>email</li>
                <li>role (e.g., student, instructor)</li>
              </ul>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto whitespace-nowrap">
                first_name,last_name,email,role<br/>
                John,Doe,john@example.com,student<br/>
                Jane,Smith,jane@example.com,instructor
              </div>
              <p className="text-xs text-amber-400/90 mt-2 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                Note: All users will be created with the default password <strong>Ntanda2026!</strong>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Results Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {importResult && (
            <Card className={`border ${importResult.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {importResult.success ? (
                    <CheckCircle className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${importResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                      {importResult.message}
                    </h3>
                    {importResult.success && (
                      <p className="text-slate-300 mt-1">Successfully imported <strong>{importResult.count}</strong> users.</p>
                    )}
                    
                    {importResult.errors && importResult.errors.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Warnings & Errors:</h4>
                        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50 max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                          {importResult.errors.map((err, idx) => (
                            <div key={idx} className="text-xs text-amber-400/90">{err}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {parsedData.length > 0 && (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Data Preview</CardTitle>
                <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium">
                  {parsedData.length} valid rows
                </span>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {parsedData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{row.first_name} {row.last_name}</td>
                          <td className="px-6 py-4">{row.email}</td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs capitalize">
                              {row.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedData.length > 10 && (
                    <div className="p-4 text-center text-sm text-slate-500 bg-slate-950/30 border-t border-slate-800/50">
                      Showing 10 of {parsedData.length} rows...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {!file && !importResult && (
            <div className="h-full min-h-[300px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 bg-slate-900/20">
              <FileSpreadsheet className="h-12 w-12 mb-4 opacity-50" />
              <p>Upload a CSV file to preview the data here.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminBulkImport;
