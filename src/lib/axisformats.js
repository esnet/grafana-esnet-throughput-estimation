function logarithmic_format(unit){
  return function(bytes){
    if(unit === null || unit === undefined){ unit = 'b' }
    bytes = parseInt(bytes, 10)
    if(bytes === 0){ return "0" }
    // calculate the 1024-based log of the bytes value
    let log1024 = Math.floor(Math.log(bytes) / Math.log(1024));
    const unit_prefixes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    let unit_prefix = unit_prefixes[log1024];
    return (bytes/Math.pow(1024, log1024)).toFixed(2) + " " + unit_prefix + unit
  }
}

export const format_bit_size = logarithmic_format('b')
export const format_byte_size = logarithmic_format('B')
export const format_1024 = logarithmic_format('')