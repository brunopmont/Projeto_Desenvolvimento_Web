package com.bruno.restapi.exception;

public class AlunoNaoEncontradoException extends Exception
{	
	private final static long serialVersionUID = 1;
	
	private int codigo;
	
	public AlunoNaoEncontradoException(String msg)
	{	super(msg);
	}

	public AlunoNaoEncontradoException(int codigo, String msg)
	{	super(msg);
		this.codigo = codigo;
	}
	
	public int getCodigoDeErro()
	{	return codigo;
	}
}	