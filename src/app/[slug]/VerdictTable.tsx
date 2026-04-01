// 移除 "use client" 指令，让 VerdictTable 组件在服务器端和客户端都能渲染

export default function VerdictTable({ monthlyPrice = 20.99 }: { monthlyPrice?: number }) {
  return (
    <table 
      itemScope 
      itemType="http://schema.org/Table"
      className="mt-6 w-full border-collapse"
    >
      <thead>
        <tr className="bg-slate-50">
          <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Comparison</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Traditional SaaS</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-yellow-400">StopSaaS</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        <tr>
          <td className="px-4 py-3 text-sm text-slate-700 font-medium">Wait Time</td>
          <td className="px-4 py-3 text-sm text-slate-500 line-through">App Loading + Login (30s+)</td>
          <td className="px-4 py-3 text-sm text-yellow-400 font-bold border border-yellow-400 rounded-md shadow-sm">Instant (Local)</td>
        </tr>
        <tr>
          <td className="px-4 py-3 text-sm text-slate-700 font-medium">Privacy</td>
          <td className="px-4 py-3 text-sm text-slate-500 line-through">Uploaded to Cloud Servers</td>
          <td className="px-4 py-3 text-sm text-yellow-400 font-bold border border-yellow-400 rounded-md shadow-sm">100% Private (Browser Only)</td>
        </tr>
        <tr>
          <td className="px-4 py-3 text-sm text-slate-700 font-medium">Storage</td>
          <td className="px-4 py-3 text-sm text-slate-500 line-through">2GB+ Disk Space</td>
          <td className="px-4 py-3 text-sm text-yellow-400 font-bold border border-yellow-400 rounded-md shadow-sm">0KB (Web App)</td>
        </tr>
        <tr>
          <td className="px-4 py-3 text-sm text-slate-700 font-medium">Cost</td>
          <td className="px-4 py-3 text-sm text-slate-500 line-through">${monthlyPrice}/mo Forever</td>
          <td className="px-4 py-3 text-sm text-yellow-400 font-bold border border-yellow-400 rounded-md shadow-sm">$0.00</td>
        </tr>
      </tbody>
    </table>
  );
}
