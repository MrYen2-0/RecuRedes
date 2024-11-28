export default async function checkToken(token, navigate) {
    let response = await fetch(`${process.env.RED}/auth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });
    response = await response.json();
    if (!response.success) {
        console.error("Usuario no valido");
        return false;
    } else {
        console.info("usuario valido");
        return true;
    }
}

