import Head from 'next/head';

const TablesDisplay = ({ columns, data }) => {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cell}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablesDisplay;
