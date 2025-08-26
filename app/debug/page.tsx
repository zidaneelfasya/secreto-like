import MobileDebugTest from '@/components/mobile-debug-test';

export default function DebugPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Mobile Debug Test</h1>
          <p className="text-gray-600">Test endpoint connectivity from mobile devices</p>
        </div>
        
        <MobileDebugTest />
      </div>
    </div>
  );
}
