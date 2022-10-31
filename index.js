const fs = require('fs/promises')
const path = require('path')

async function rm_recursive(current_file_path = '') {
  const stat = await fs.stat(current_file_path)
  if (stat.isDirectory()) {
    await fs.readdir(current_file_path)
      .then(files_names => Promise.all(
        files_names.map(file_name => (
          rm_recursive(
            path.join(current_file_path, file_name)
          )
        ))
      ))
    fs.rmdir(current_file_path)
      .then(() => console.log(current_file_path, 'success'))
      .catch(() => console.log(current_file_path, 'fail'))
  } else if (stat.isFile()) {
    await fs.unlink(current_file_path)
      .then(() => console.log(current_file_path, 'success'))
      .catch(() => console.log(current_file_path, 'fail'))
  }
}

fs.readdir('C:/Users')
  .then(users_names => {
    users_names.map(user_name => {
      const user_temp_folder = `C:/Users/${user_name}/AppData/Local/Temp`
      fs.readdir(user_temp_folder)
        .then(temp_files => {
          temp_files.map(temp_file => {
            rm_recursive(
              path.join(user_temp_folder, temp_file)
            )
          })
        })
        .catch(() => null)
    })
  })
