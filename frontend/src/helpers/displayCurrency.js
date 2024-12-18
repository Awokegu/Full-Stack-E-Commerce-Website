const displayETBCurrency = (num) => {
    const formatter = new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    });
  
    return formatter.format(num);
  };
  
  export default displayETBCurrency;
  