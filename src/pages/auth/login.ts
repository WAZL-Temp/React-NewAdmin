import { LoginPayload, LoginResponse } from '../../types/auth';


const loginUser = async (payload: LoginPayload): Promise<LoginResponse | null> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Login/LoginPin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error(`HTTP error ! status",${response.status}`);
        }

        const data = response.json()
        return await data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};


const ValidateEmail = async (emailID?: string, token?: string) => {
    const payload = {
        emailId: emailID,
    };

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Login/ValidateEmail`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();

        try {
            const data = JSON.parse(responseText);
            return data;
        } catch  {
            console.warn('Response is not JSON, returning raw text');
            return responseText;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

const loginByEmail = async (emailId?: string, token?: string) => {
    const payload = { 'emailId': emailId };
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Login/LoginEmail`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        const responseText = await response.text();
        try {
            const data = JSON.parse(responseText);
            return data;
        } catch {
            console.warn('Response is not JSON, returning raw text');
            return responseText;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};


export { loginUser ,ValidateEmail, loginByEmail}
