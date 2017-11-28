<?php

namespace AppBundle\DependencyInjection;

use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationListInterface;

class ErrorService
{
	/**
	 * @param ConstraintViolationListInterface $validationErrors
	 * @return array
	 * @todo: rename method name
	 */
	public function getArrayWithErrors(ConstraintViolationListInterface $validationErrors)
	{
		$errors = [];

		/** @var ConstraintViolation $validationError */
		foreach ($validationErrors as $validationError) {
			$errors[] = [
				'message' => $validationError->getMessage(),
				'field' => $validationError->getPropertyPath()
			];
		}

		return [
			'message' => 'Validation errors in your request',
			'errors' => $errors
		];
	}
}