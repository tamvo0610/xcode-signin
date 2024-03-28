import { exec as execCP } from 'child_process'

export const run = async (str: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    execCP(str, (error, stdout) => {
      if (error) {
        return reject(error.message)
      }
      resolve(stdout.trim())
    })
  })
}

export const mkdir = async (path: string): Promise<string> => {
  return await run(`mkdir -p ${path}`)
}

export const rsync = async (source: string, dest: string): Promise<string> => {
  return await run(`rsync -a ${source}/ ${dest}`)
}

export const exists = async (path: string): Promise<boolean> => {
  const res = await run(
    `if [ -d "${path}" ]; then 
            echo "1"; 
        else 
            echo "0"; 
        fi`
  )
  return res === '1'
}
