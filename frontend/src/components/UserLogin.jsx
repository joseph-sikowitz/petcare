export default function UserLogin() {
    fetch("api/users")
    .then(res => res.json())
    .then(data => console.log("User data:", data));

    return (
        <>
          <h1>Test User Data</h1>
          <section>
            <p>Hello, find the data in the console for now.</p>
          </section>
        </>
    )
}