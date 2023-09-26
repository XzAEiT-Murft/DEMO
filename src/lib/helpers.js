const bcrypt = require('bcryptjs')
const ayudas = {}

ayudas.encryptP = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const Pencryp = await bcrypt.hash(password, salt)
  return Pencryp
}

ayudas.matchP = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword)
  } catch(e) {
    console.log(e)
  }
}

module.exports = ayudas